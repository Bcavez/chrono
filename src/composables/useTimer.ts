import { ref } from "vue";

/**
 * Calculate the current remaining time from a start time and a given total duration
 *
 * @param startTime
 * @param duration
 */
export const getRemainingTime = (startTime: number, duration: number): number => {
    const current = Date.now()
    const elapsed = current - startTime
    const remaining = duration - elapsed

    // Do not return negative numbers
    return Math.max(remaining, 0)
}

export const useTimer = () => {
    const isRunning = ref(false);
    const duration = 15 * 60 * 1000;
    const remaining = ref(duration);
    const startTime = ref(0);

    /**
     * Click on start button
     *
     * Start timer for initial duration or resume for remaining time
     */
    const start = (): void => {
        // Refresh startTime because it is from there that we need to calculate remaining time
        startTime.value = Date.now();
        // Obviously it's not paused or stopped anymore
        isRunning.value = true;
    }

    /**
     * Click on pause button
     *
     * Pause timer and calculate remaining time to allow later resume
     */
    const pause = (): void => {
        // Don't run pause if timer has never started yet.
        if (startTime.value === 0) {
            return;
        }
        // Store remaining time, so we can resume timer display to the correct value
        remaining.value = getRemainingTime(startTime.value, remaining.value)
        isRunning.value = false
    }

    /**
     * Click on reset button
     *
     * Reinitialise everything
     */
    const reset = (): void => {
        startTime.value = 0
        remaining.value = duration
        isRunning.value = false
    }

    return { remaining, isRunning, startTime, duration, reset, start, pause }
}
