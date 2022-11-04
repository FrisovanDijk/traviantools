<script setup>
    import NPCCalculator from "@/components/calculators/NPCCalculator.vue";
    import FeederAutomation from "@/components/calculators/FeederAutomation.vue";
    import { userData } from '@/stores/userData.js'
</script>

<template>
    <div class="flex space-4 flex-wrap items-start">
        <template v-for="(item, index) in userData.tabs[userData.currentTab].calculators">

            <NPCCalculator v-if="item.name === 'NPCCalculator'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <FeederAutomation v-else-if="item.name === 'FeederAutomation'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />
        </template>
        <div v-if="userData.tabs[userData.currentTab].calculators.length === 0" class="m-4 rounded border bg-white p-4" style="width: 310px">
            Use the icons on the left to open calculators and create tabs.
            <br/>Data is only stored locally. It will be deleted when clearing your browser history.
        </div>
    </div>
</template>
