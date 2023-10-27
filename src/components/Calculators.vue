<script setup>
    import NPCCalculator from "@/components/calculators/NPCCalculator.vue";
    import FeederAutomation from "@/components/calculators/FeederAutomation.vue";
    import VillageTimer from "@/components/calculators/VillageTimer.vue";
    import MerchantTrips from "@/components/calculators/MerchantTrips.vue";
    import TotalResources from "@/components/calculators/TotalResources.vue";
    import ROICalculator from "@/components/calculators/ROICalculator.vue";
    import ProductionOverview from "@/components/calculators/ProductionOverview.vue";
    import UltimateROI from "@/components/calculators/UltimateROI.vue";
    import TroopsTrainingCalculator from "@/components/calculators/TroopsTrainingCalculator.vue";
    import TroopCostCalculator from "@/components/calculators/TroopCostCalculator.vue";
    import SmithyEfficiency from "@/components/calculators/SmithyEfficiency.vue";
    import TroopsCompare from "@/components/calculators/TroopsCompare.vue";
    import Help from "@/components/calculators/Help.vue";
    import { userData } from '@/stores/userData.js'
</script>

<template>
    <div class="flex gap-4 flex-wrap items-start">
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

            <ROICalculator v-else-if="item.name === 'ROICalculator'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <ProductionOverview v-else-if="item.name === 'ProductionOverview'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <UltimateROI v-else-if="item.name === 'UltimateROI'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <TroopsTrainingCalculator v-else-if="item.name === 'TroopsTraining'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <TroopCostCalculator v-else-if="item.name === 'TroopCost'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <SmithyEfficiency v-else-if="item.name === 'SmithyEfficiency'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <TroopsCompare v-else-if="item.name === 'TroopsCompare'"
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
