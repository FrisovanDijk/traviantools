<script setup>
    import NPCCalculator from "@/components/calculators/NPCCalculator.vue";
    import FeederAutomation from "@/components/calculators/FeederAutomation.vue";
    import VillageTimer from "@/components/calculators/VillageTimer.vue";
    import MerchantTrips from "@/components/calculators/MerchantTrips.vue";
    import TotalResources from "@/components/calculators/TotalResources.vue";
    import Help from "@/components/calculators/Help.vue";
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

            <VillageTimer v-else-if="item.name === 'VillageTimer'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <MerchantTrips v-else-if="item.name === 'MerchantTrips'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <TotalResources v-else-if="item.name === 'TotalResources'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <Help v-else-if="item.name === 'Help'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />
        </template>
        <template v-if="userData.tabs[userData.currentTab].calculators.length === 0" class="m-4 rounded border bg-white p-4" style="width: 310px">
            <Help :key="STATICHELP" />
        </template>
    </div>
</template>
