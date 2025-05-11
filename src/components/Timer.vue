<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {getRemainingTime, useTimer} from "../composables/useTimer.ts";

const { status } = defineProps<{
    status: 'PAUSED' | 'RUNNING' | 'RESET';
}>()
const { isRunning, remaining, startTime, pause, start, reset } = useTimer()

let timerInterval = 0

/**
 * We avoid updating state here to prevent any state update loops issue
 * We therefore need a local ref to keep track of the remaining time.
 *
 * This ref is initialised with remaining time,
 * if the timer is already started (running or paused)
 */
const remainingTime = ref(remaining.value)

/**
 * Update minutes in display from remaining time
 */
const minutes = computed(() => {
    const date = new Date(remainingTime.value)

    return padNumber(date.getMinutes())
})

/**
 * Update seconds in display from remaining time
 */
const seconds = computed(() => {
    const date = new Date(remainingTime.value)

    return padNumber(date.getSeconds())
})

/**
 * Helper to pad a number with leading 0
 *
 * @param value
 */
const padNumber = (value: number): string => String(value).padStart(2, '0')

/**
 * This is where most of the magic happens.
 *
 * Remaining time is calculated and updated
 * Display is updated with correct values for hours/minutes/seconds
 *
 * React to missing data (e.g. startTime or remaining)
 */
function tick() {
    // Ref update will trigger update of display, so that's it for this function already
    remainingTime.value = getRemainingTime(startTime.value, remaining.value)
}

/**
 * Helper to get things moving
 */
function startInterval() {
    // Do not wait 500ms to start the first iteration
    tick()
    // Update frequently according to the browser clock
    // every 500ms so that if we have some processing delay we avoid jumping numbers
    timerInterval = setInterval(() => {
        tick()
    }, 500)
}

/**
 * Helper to freeze timer
 */
function stopInterval() {
    clearInterval(timerInterval)
}

/**
 * Watching running state to respond to commands from control panel
 * Start watching immediately to properly initialise if already started
 */
watch(
    () => isRunning.value,
    () => {
        if (isRunning.value) {
            // Respond to start : define interval
            startInterval()
        } else {
            // Respond to pause/stop : clear interval
            stopInterval()
        }
    },
    { immediate: true }
)

/**
 * Watching startTime state to respond to timer configuration update
 */
watch(() => status, (value) => {
    if (value === 'PAUSED') {
        pause()
    }
    if (value === 'RUNNING') {
        start()
    }
    if (value === 'RESET') {
        reset()
        remainingTime.value = remaining.value;
    }
})

/**
 * Clean up when leaving
 */
onBeforeUnmount(() => {
    stopInterval()
})
</script>

<template>
    <div class="clock animated" ref="clockElement">
        <div class="time-part minutes">
            <span>{{ minutes }}</span>
        </div>
        <div class="colon">:</div>
        <div class="time-part seconds">
            <span>{{ seconds }}</span>
        </div>
    </div>
</template>

<style scoped>
.clock {
    color: white;
    font-family: 'E1234', sans-serif;
    border-radius: 4px;
    font-size: 20vh;
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    padding: 3px;
    display: flex;
    opacity: 1;
    transition:
        visibility 1s ease-in-out,
        opacity 2s ease-in-out;

    & div {
        list-style: none;
        border-radius: 4px;
        text-align: center;
        width: auto;

        &.time-part {
            padding: 0 5px;
            background: #333333;
            position: relative;

            span {
                /* Make numbers appears before the 88 background */
                position: relative;
                z-index: 2;
            }

            &:after {
                content: '88';
                color: #414141;
                /* Place 88 as the background of numbers */
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
        }
        &.colon {
            padding: 0;
            margin: 0 -5px;
            color: #333333;
        }
    }
}
</style>
