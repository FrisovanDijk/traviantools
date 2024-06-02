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
            <p><span class="font-semibold">Update 3.2</span> introduces a new CP helper and a confirmation on deleting all calculators.</p>
            <p>Use the icons on the left to open calculators to assist in your Travian gameplay.</p>
            <p>You can open multiple tabs with calculators in desktop mode to distinguish between accounts or servers.</p>
            <p>All data is stored locally on your browser, so it will be gone when you remove your local data.</p>
            <p>Questions, feedback or bugs? Add faerland on Discord</p>
            <p class="text-xs pt-2 border-t border-slate-400">Known issues:</p>
            <ul class="list-disc list-inside text-xs">
                <li>Opening multiple of the same type of calculator and closing any closes the last one.</li>
                <li>6c and 7c with 25/25 or 50% oasis shows wrong simulation for bakery. Simulate without oases to get the right numbers.</li>
            </ul>
        </div>
    </CalculatorWrapper>
</template>
