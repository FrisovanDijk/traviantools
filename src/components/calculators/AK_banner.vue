<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"

    const props = defineProps({
        index: {
            type: Number,
            default: -1
        }
    })
</script>

<template>
    <a href="https://aetherkingdoms.com" target="_blank">
        <CalculatorWrapper title="Like my tools? Try my game!"
                           :close="false"
                           noMargin
                           type="ak"
        >
                <img src="/img/ak_banner.png" alt="Aether Kingdoms banner image" />
        </CalculatorWrapper>
    </a>
</template>
