import {ref, watch} from "vue";

export default () => {
    // Keep track of the status of each clock.
    const statuses = ref<Record<1 | 2 | 3, 'RESET' | 'RUNNING' | 'PAUSED'>>({
        1: 'RESET',
        2: 'RESET',
        3: 'RESET'
    })
    // Keep track of which clock is currently active.
    // When this is set to zero, everything is reset and no clocks are active
    const currentRunning = ref<0 | 1 | 2 | 3 | 4>(0);

    // Simple up and down counter helpers which loops around when going below 1 or above 3.
    const up = () => {
        currentRunning.value++;
        if (currentRunning.value > 3) {
            currentRunning.value = 1;
        }
        return currentRunning.value;
    }
    const down = () => {
        currentRunning.value--;
        if (currentRunning.value < 1) {
            currentRunning.value = 3;
        }
        return currentRunning.value;
    }

    // This is where user can control which clock is active.
    // Space to start clock 1 and to go the next clock.
    // Enter to go to the previous clock.
    // Escape to reset everything.
    if (window) {
        window.addEventListener('keyup', (event) => {
            event.preventDefault()
            if (event.code === 'Space') {
                up()
            }

            if (event.code === 'Enter') {
                down()
            }

            if (event.code === 'Escape') {
                if (!confirm('Are you sure ?')) {
                    return
                }
                currentRunning.value = 0;
            }

            // This is not super clean...
            // 4 is not among the allowed numbers, so this will pause all.
            if (event.code === 'Backspace') {
                currentRunning.value = 4;
            }
        })
    }

    // Depending on which clock is currently active, we pause others.
    // Trigger a full reset when this value is set to 0.
    watch(() => currentRunning.value, () => {
        if (currentRunning.value === 0) {
            statuses.value[1] = 'RESET';
            statuses.value[2] = 'RESET';
            statuses.value[3] = 'RESET';
            return;
        }
        statuses.value[1] = 'PAUSED';
        statuses.value[2] = 'PAUSED';
        statuses.value[3] = 'PAUSED';
        if (currentRunning.value === 4) {
            return;
        }
        statuses.value[currentRunning.value] = 'RUNNING';
    })

    return statuses;
}
