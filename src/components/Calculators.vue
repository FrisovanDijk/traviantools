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

            <FeederAutomation v-if="item.name === 'FeederAutomation'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

        </template>
    </div>
</template>
