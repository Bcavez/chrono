<script setup lang="ts">
import Timer from "./components/Timer.vue";
import useTimerControl from "./composables/useTimerControl.ts";

console.info(" Press 'Space' to start the first timer \n Press 'Space' to pause the current timer and start the next one \n Press 'Enter' to pause the current timer and start the previous one \n Press 'Escape' to reset all timers \n Press 'Backspace' to pause all timers")
const statuses = useTimerControl()

</script>

<template>
    <div class="container">
        <div class="justify">
            <Timer :status="statuses[1]" class="border red" :class="statuses[1] === 'RUNNING' ? 'active' : ''"/>
        </div>
        <div class="justify">
            <Timer :status="statuses[2]" class="border blue" :class="statuses[2] === 'RUNNING' ? 'active' : ''"/>
        </div>
        <div class="justify">
            <Timer :status="statuses[3]" class="border green" :class="statuses[3] === 'RUNNING' ? 'active' : ''"/>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.border {
    border-style: solid;
    border-width: 4px;
}

.active {
    border-width: 10px;
}

.red {
    border-color: red;
}
.blue {
    border-color: blue;
}
.green {
    border-color: green;
}

.justify {
    display: flex;
    justify-content: center;
}
</style>
