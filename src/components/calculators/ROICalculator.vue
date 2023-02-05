<script setup>
    import ResImg from "@/components/ResImg.vue";
    import ResList from '@/components/ResList.vue'
    import OasisSelector from '@/components/OasisSelector.vue'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import RadioSelect from "@/components/RadioSelect.vue"

    import buildingsJson from '@/data/buildings.json'
    import productionJson from '@/data/production.json'
    import villagesJson from '@/data/village_types.json'

    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
    const roiTime = ref('')

    onBeforeMount(() => {
        calculateROI()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const updateROIType = (type) => { calculator.roiType = type; calculateROI() }
    const updateFieldType = (type) => {
        calculator.fieldType = type
        if(calculator.bonusBuilding > 5 && type !== 'crop')  {
            calculator.bonusBuilding = 5
        }
        calculateROI()
    }
    const updateOasis = (data) => { calculator.oases[data.i-1] = data.type; calculateROI()}

    const calculateROI = () => {
        if(calculator.roiType === 'field') {
            let buildingType = 'Cropland'
            if(calculator.fieldType === 'lumber') buildingType = 'Woodcutter'
            if(calculator.fieldType === 'clay') buildingType = 'Clay Pit'
            if(calculator.fieldType === 'iron') buildingType = 'Iron Mine'

            const cost = buildingsJson[buildingType][calculator.fieldToLevel-1].total_res
            const productionDelta = productionJson[calculator.fieldToLevel] - productionJson[calculator.fieldToLevel-1]

            let bonus = calculator.bonusBuilding * 0.05
            calculator.oases.forEach((oasis) => {
                if(oasis.type1 === calculator.fieldType) bonus += 0.25
                if(oasis.type2 === calculator.fieldType) bonus += 0.25
            })

            const netProductionDelta = productionDelta + productionDelta * bonus
            const totalProductionDelta = netProductionDelta * (calculator.goldBonus ? 1.25 : 1)
            const roiHours = cost / totalProductionDelta
            const roiDays = roiHours/24
            const days = Math.floor(roiDays)
            const hoursfraction = (roiDays - days) * 24
            const hours = Math.floor(hoursfraction)
            const minutesfraction = (hoursfraction - hours) * 60
            const minutes = Math.round(minutesfraction)

            roiTime.value = `${days} days, ${hours} hours, ${minutes} minutes`
        } else {
            roiTime.value = 'Not yet implemented'
        }
    }
</script>

<template>
    <CalculatorWrapper title="Return on investment" @close:calculator="close">
        <div class="flex px-2 border-b pb-2 mb-4 border-gray-500">
            <RadioSelect legend="ROI type" :options="['field', 'building', 'HM']" :selected="calculator.roiType" @selection="updateROIType" />
        </div>

        <!-- RESOURCE FIELD ROI -->
        <template class v-if="calculator.roiType === 'field'">
            <div class="flex px-2">
                <RadioSelect legend="Field type" :options="['crop', 'lumber', 'clay', 'iron']" :selected="calculator.fieldType" @selection="updateFieldType" />
            </div>

            <div class="flex px-2 mt-3 text-sm items-center space-x-3">
                <div class="w-16">Oases</div>
                <OasisSelector v-for="i in calculator.oases.length"
                               :index="i"
                               :selected="calculator.oases[i-1]"
                               @selection="updateOasis"
                />
            </div>

            <div class="flex px-2 mt-3 text-sm items-center space-x-3">
                <div class="w-16">Bonus bld.</div>
                <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                        v-model="calculator.bonusBuilding"
                        @change="calculateROI"
                >
                    <option v-for="(i, n) in (calculator.fieldType === 'crop' ? 11 : 6)"
                            :key="n"
                            class="px-0.5"
                    >
                        {{ n }}
                    </option>
                </select>
            </div>

            <div class="flex px-2 mt-3 text-sm items-center space-x-3">
                <div class="w-16">To level</div>
                <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                        v-model="calculator.fieldToLevel"
                        @change="calculateROI"
                >
                    <option v-for="n in 20"
                            :key="n"
                            class="px-0.5"
                    >
                        {{ n }}
                    </option>
                </select>
            </div>
        </template>

        <!-- RESOURCE BUILDING ROI -->
        <template class v-if="calculator.roiType === 'building'">
            <div class="p-4 bg-gray-200 w-full text-center">
                <div class="w-8 mx-auto text-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg></div>
                <div>Work in progress</div>
            </div>
        </template>

        <!-- HERO MANSION ROI -->
        <template class v-if="calculator.roiType === 'HM'">
            <div class="p-4 bg-gray-200 w-full text-center">
                <div class="w-8 mx-auto text-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg></div>
                <div>Work in progress</div>
            </div>
        </template>

        <div class="flex px-2 mt-3 text-sm items-center space-x-3">
            <label>Gold +25%
                <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                       v-model="calculator.goldBonus"
                       @change="calculateROI"
                />
            </label>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">ROI</h2>
        <div class="bg-yellow-200 p-2">
            {{ roiTime }}
        </div>
    </CalculatorWrapper>
</template>
