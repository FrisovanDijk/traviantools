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
    import VillagePlanner from "@/components/calculators/VillagePlanner.vue";
    import CropScouter from "@/components/calculators/CropScouter.vue";
    import CPCostCalculator from "@/components/calculators/CPCostCalculator.vue";
    import Help from "@/components/calculators/Help.vue";
    import { userData } from '@/stores/userData.js'
    import { onMounted, onUpdated, watch } from 'vue'

    onMounted(() => {
        getMasonry()

        const masonry = document.querySelector('.masonry')
        const calculators = masonry.querySelectorAll('.calculator')
        new ResizeObserver(getMasonry).observe(masonry)
        calculators.forEach((e) => { new ResizeObserver(getMasonry).observe(e) })
    })

    onUpdated(() => {
        getMasonry()
    })

    watch(userData.tabs[userData.currentTab].calculators, () => {
        // Cleaning empty objects
        userData.tabs[userData.currentTab].calculators = userData.tabs[userData.currentTab].calculators.filter(element => {
            return Object.keys(element).length !== 0;
        })

        const masonry = document.querySelector('.masonry')
        const calculators = masonry.querySelectorAll('.calculator')
        new ResizeObserver(getMasonry).observe(calculators[calculators.length - 1])
    })

    const getMasonry = () => {
        const colWidth = 320
        const masonry = document.querySelector('.masonry')
        const columns = Math.max(1, Math.floor(masonry.offsetWidth / colWidth))
        const calculators = masonry.querySelectorAll('.calculator')

        const nextheight = []
        for(let i = 0; i < columns; i++) {
            nextheight.push(0)
        }

        calculators.forEach((calculator, i) => {
            const setColumn = nextheight.indexOf(Math.min(...nextheight))
            calculator.style.position = 'absolute'
            calculator.style.left = colWidth * setColumn + 'px'
            calculator.style.top = nextheight[setColumn] + 'px'
            nextheight[setColumn] = nextheight[setColumn] + calculator.offsetHeight + 10
        })
        masonry.style.height = Math.max(...nextheight)
    }

    const setObservers = () => {
        const masonry = document.querySelector('.masonry')
        const calculators = masonry.querySelectorAll('.calculator')
        new ResizeObserver(getMasonry).observe(masonry)
        calculators.forEach((e) => { new ResizeObserver(getMasonry).observe(e) })
    }
</script>

<template>
    <div class="masonry">

        <template v-for="(item, index) in userData.tabs[userData.currentTab].calculators" @change="setObservers">

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

            <VillagePlanner v-else-if="item.name === 'VillagePlanner'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <CropScouter v-else-if="item.name === 'CropScouter'"
                           :index="index"
                           :key="`${userData.currentTab}.${index}`"
                           />

            <CPCostCalculator v-else-if="item.name === 'CPCostCalculator'"
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
