<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: {
            type: Number,
            default: -1
        }
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
    }
</script>

<template>
    <CalculatorWrapper title="Calculator help" @close:calculator="close" :close="index >= 0">
        <div class="px-4 pt-1 pb-3 text-sm flex flex-col space-y-3">
            <p>Use the icons on the left to open various calculators to assist your gameplay.</p>
            <p>You can open multiple tabs with calculators in desktop mode to distinguish between accounts or servers.</p>
            <p>All data is stored locally on your browser, so it will be gone when you remove your cached data.</p>
        </div>
    </CalculatorWrapper>
</template>
