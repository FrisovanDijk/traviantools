<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"

    const props = defineProps({
        index: Number
    })

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
</script>

<template>

</template>
