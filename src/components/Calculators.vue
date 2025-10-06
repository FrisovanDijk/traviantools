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
    import AK_banner from "@/components/calculators/AK_banner.vue";
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
        <template v-for="(item, index) in userData.tabs[userData.currentTab].calculators" @change="setObservers()">

            <template v-if="item.name === 'NPCCalculator'">
                <NPCCalculator :index="index"
                               :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'FeederAutomation'">
                <FeederAutomation :index="index"
                                  :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'VillageTimer'">
                <VillageTimer  :index="index"
                               :key="item.key"
                               @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'MerchantTrips'">
                <MerchantTrips
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'TotalResources'">
                <TotalResources
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'ROICalculator'">
                <ROICalculator
                    :index="index"
                    :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'ProductionOverview'">
                <ProductionOverview
                    :index="index"
                    :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'UltimateROI'">
                <UltimateROI
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'TroopsTraining'">
                <TroopsTrainingCalculator
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'TroopCost'">
                <TroopCostCalculator
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'SmithyEfficiency'">
                <SmithyEfficiency
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'TroopsCompare'">
                <TroopsCompare
                    :index="index"
                    :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'VillagePlanner'">
                <VillagePlanner
                    :index="index"
                    :key="item.key"
                    @repaint="getMasonry()"
                />
            </template>
            <template v-else-if="item.name === 'CropScouter'">
                <CropScouter
                    :index="index"
                    :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'CPCostCalculator'">
                <CPCostCalculator
                    :index="index"
                    :key="item.key"
                />
            </template>
            <template v-else-if="item.name === 'Help'">
                <Help
                    :index="index"
                    :key="item.key"
                />
            </template>

        </template>

        <template v-if="userData.tabs[userData.currentTab].calculators.length === 0" class="m-4 rounded border bg-white p-4" style="width: 310px">
            <Help :key="STATICHELP" />
        </template>

        <AK_banner />
    </div>
</template>
