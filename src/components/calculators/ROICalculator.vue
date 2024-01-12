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
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
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
    const updateBuildingType = (type) => {
        calculator.buildingType = type
        if(calculator.buildingToLevel > 5 && type !== 'crop')  {
            calculator.buildingToLevel = 5
        }
        calculateROI()
    }
    const addField = (type) => { calculator.fields[type].push({ level: 0, amount: 1})}
    const updateHmLevel = (level) => {
        calculator.hmToLevel = level
        calculateROI()
    }
    const updateHmOasis = (data) => { calculator.hmOasis = data.type; calculateROI()}

    const calculateROI = () => {
        let roiHours = 0
        if(calculator.roiType === 'field') {
            const roi = calculateFieldROI(calculator.fieldType, calculator.fieldToLevel)

            let bonus = calculator.bonusBuilding * 0.05
            calculator.oases.forEach((oasis) => {
                if(oasis.type1 === calculator.fieldType) {
                    bonus += 0.25
                    bonus += 0.0125 * calculator.egyptian
                }
                if(oasis.type2 === calculator.fieldType) {
                    bonus += 0.25
                    bonus += 0.0125 * calculator.egyptian
                }
            })

            const netProductionDelta = roi.productionDelta + roi.productionDelta * bonus
            const totalProductionDelta = netProductionDelta * (calculator.goldBonus ? 1.25 : 1)

            roiHours = roi.cost / totalProductionDelta
        }
        if(calculator.roiType === 'building') {
            let buildingType = 'Grain Mill'
            let toLevel = calculator.buildingToLevel
            if(calculator.buildingType === 'crop' && toLevel > 5) {
                buildingType = 'Bakery'
                toLevel -= 5
            }
            if(calculator.buildingType === 'lumber') buildingType = 'Sawmill'
            if(calculator.buildingType === 'clay') buildingType = 'Brickyard'
            if(calculator.buildingType === 'iron') buildingType = 'Iron Foundry'

            let prodGross = 0
            let highestFieldRow = 0 // Highest field to simulate to 10
            calculator.fields[calculator.buildingType].forEach((row) => {
                if(row.amount > 0) {
                    prodGross += row.amount * productionJson[row.level]
                    if(Number(row.level) > highestFieldRow) highestFieldRow = Number(row.level)
                }
            })

            // Get building cost
            let cost = buildingsJson[buildingType][toLevel-1].total_res
            let addLevels = 1
            // Get building cost for all levels up to that level when simulating a lv10 field
            if(calculator.simulateFieldTo10 && highestFieldRow < 10) {
                cost = 0
                addLevels = toLevel
                for(let i = 0; i < toLevel; i++) {
                    cost += buildingsJson[buildingType][i].total_res
                }
            }

            let productionDelta = 0.05 * addLevels * prodGross

            // Simulate highest field to lv10
            if(calculator.simulateFieldTo10 && highestFieldRow < 10) {
                let simFieldCost = 0
                let simFieldProdDelta = 0

                for(let i = 10; i > highestFieldRow; i--) {
                    const field = calculateFieldROI(calculator.buildingType, i)
                    simFieldCost += field.cost
                    simFieldProdDelta += field.productionDelta
                }

                cost += simFieldCost
                productionDelta += simFieldProdDelta + 0.05 * addLevels * simFieldProdDelta
            }

            const totalProductionDelta = productionDelta * (calculator.goldBonus ? 1.25 : 1)

            roiHours = cost / totalProductionDelta
        }
        if(calculator.roiType === 'HM') {
            const toLevel = calculator.hmToLevel
            let fromLevel = 0
            if(toLevel === 15) fromLevel = 10
            if(toLevel === 20) fromLevel = 15
            // Get building cost
            let cost = 0
            for(let i = fromLevel; i < toLevel; i++) {
                cost += buildingsJson["Hero's Mansion"][i].total_res
            }

            // Get field production
            let prodGrossType1 = 0
            let prodGrossType2 = 0
            if(calculator.hmOasis.type1) {
                calculator.fields[calculator.hmOasis.type1].forEach((row) => {
                    if(row.amount > 0) {
                        prodGrossType1 += row.amount * productionJson[row.level]
                    }
                })
            }
            if(calculator.hmOasis.type2) {
                calculator.fields[calculator.hmOasis.type2].forEach((row) => {
                    if (row.amount > 0) {
                        prodGrossType2 += row.amount * productionJson[row.level]
                    }
                })
            }

            let productionDelta = 0
            if(calculator.hmOasis.type1 !== calculator.hmOasis.type2) {
                productionDelta += 0.25 * prodGrossType1 + 0.25 * prodGrossType2
            } else {
                productionDelta += 0.5 * prodGrossType1
            }

            const totalProductionDelta = productionDelta * (calculator.goldBonus ? 1.25 : 1)

            roiHours = cost / totalProductionDelta
        }

        const roiDays = roiHours/24
        const days = Math.floor(roiDays)
        const hoursfraction = (roiDays - days) * 24
        const hours = Math.floor(hoursfraction)
        const minutesfraction = (hoursfraction - hours) * 60
        const minutes = Math.round(minutesfraction)

        roiTime.value = `${days} days, ${hours} hours, ${minutes} minutes`
    }

    const calculateFieldROI = (fieldType, toLevel) => {
        let buildingType = 'Cropland'
        if(fieldType === 'lumber') buildingType = 'Woodcutter'
        if(fieldType === 'clay') buildingType = 'Clay Pit'
        if(fieldType === 'iron') buildingType = 'Iron Mine'

        const cost = buildingsJson[buildingType][toLevel-1].total_res
        const productionDelta = productionJson[toLevel] - productionJson[toLevel-1]

        return {
            cost: cost,
            productionDelta: productionDelta
        }
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="economy">
        <div class="flex px-4 border-b pb-4 mb-4 border-gray-500 mt-2">
            <RadioSelect legend="ROI type" :options="['field', 'building', 'HM']" :selected="calculator.roiType" @selection="updateROIType" />
        </div>

        <!-- RESOURCE FIELD ROI -->
        <template class v-if="calculator.roiType === 'field'">
            <div class="flex px-4">
                <RadioSelect legend="Field type" :options="['crop', 'lumber', 'clay', 'iron']" :selected="calculator.fieldType" @selection="updateFieldType" />
            </div>

            <div class="flex px-4 mt-4 text-sm items-center gap-2">
                <div class="w-16">Oases</div>
                <OasisSelector v-for="i in calculator.oases.length"
                               :index="i"
                               :selected="calculator.oases[i-1]"
                               @selection="updateOasis"
                />
            </div>

            <div class="flex px-4 mt-4 items-center gap-2 justify-between">
                <div class="flex items-center gap-2">
                    <div class="">Bonus bld.</div>
                    <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm pl-1 py-0.5"
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
                <div class="flex items-center gap-2">
                    <div class="">Waterworks</div>
                    <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm pl-1 py-0.5 mr-5"
                            v-model="calculator.egyptian"
                            @change="calculateROI"
                    >
                        <option v-for="(i, n) in 21"
                                :key="n"
                                class="px-0.5"
                        >
                            {{ n }}
                        </option>
                    </select>
                </div>
            </div>


            <div class="flex px-4 mt-4 text-sm items-center gap-2">
                <div class="w-16">To level</div>
                <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm pl-1 py-0.5"
                        v-model="calculator.fieldToLevel"
                        @change="calculateROI"
                >
                    <option v-for="n in (calculator.fieldType === 'crop' ? 21 : 20)"
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
            <div class="flex px-4">
                <RadioSelect legend="Res type" :options="['crop', 'lumber', 'clay', 'iron']" :selected="calculator.buildingType" @selection="updateBuildingType" />
            </div>

            <div class="flex px-4 mt-4 text-sm items-center gap-2">
                <div class="w-16">To level</div>
                <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                        v-model="calculator.buildingToLevel"
                        @change="calculateROI"
                >
                    <option v-for="n in (calculator.buildingType === 'crop' ? 10 : 5)"
                            :key="n"
                            class="px-0.5"
                    >
                        {{ n }}
                    </option>
                </select>
            </div>

            <div class="flex-col space-y-2">
                <div class="flex px-4 mt-4 text-sm items-center space-x-3">
                    <label>Sim field to 10
                        <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                               v-model="calculator.simulateFieldTo10"
                               @change="calculateROI"
                        />
                    </label>
                </div>
                <div class="text-amber-900 bg-amber-100 px-2 text-sm py-1" v-if="calculator.simulateFieldTo10">
                    Takes the highest field (if below 10) and simulates building it to 10. Also calculates all res building levels up to the level you put in.
                </div>
            </div>

            <div class="flex px-4 mt-4 text-sm gap-2">
                <div class="w-16">Fields</div>
                <div class="flex flex-col gap-2">
                    <div class="flex gap-1 items-center"
                         v-for="(field, index) in calculator.fields[calculator.buildingType]"
                    >
                        <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                                v-model="field.amount"
                                @change="calculateROI"
                        >
                            <option v-for="(i,n) in (calculator.buildingType === 'crop' ? 16 : 6)"
                                    :key="n"
                                    class="px-0.5"
                            >
                                {{ n }}
                            </option>
                        </select>
                        <div>x level</div>
                        <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                                v-model="field.level"
                                @change="calculateROI"
                        >
                            <option v-for="(i, n) in 21"
                                    :key="n"
                                    class="px-0.5"
                            >
                                {{ n }}
                            </option>
                        </select>
                        <div v-if="index === calculator.fields[calculator.buildingType].length - 1"
                             class="flex items-center pl-2"
                        >
                            <button class="bg-green-400 rounded leading-none hover:bg-green-300 p-0.5"
                                    @click="addField(calculator.buildingType)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- HERO MANSION ROI -->
        <template class v-if="calculator.roiType === 'HM'">
            <div class="flex px-4">
                <RadioSelect legend="HM level" :options="[10, 15, 20]" :selected="calculator.hmToLevel" @selection="updateHmLevel" />
            </div>

            <div class="flex px-4 mt-4 text-sm items-center gap-2">
                <div class="w-16">Oasis</div>
                <OasisSelector :selected="calculator.hmOasis"
                               @selection="updateHmOasis"
                />
            </div>

            <div class="px-4 w-full mt-3 pt-1 text-sm font-semibold bg-amber-100">Fields</div>
            <div class="flex flex-col gap-2 py-2 bg-amber-100">
                <div class="flex px-4 text-sm gap-2"
                     v-for="fieldType in [calculator.hmOasis.type1, (calculator.hmOasis.type2 !== calculator.hmOasis.type1 ? calculator.hmOasis.type2 : '')]"
                >
                    <div class="w-16 capitalize">{{ fieldType }}</div>
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-1 items-center"
                             v-for="(field, index) in calculator.fields[fieldType]"
                        >
                            <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                                    v-model="field.amount"
                                    @change="calculateROI"
                            >
                                <option v-for="(i,n) in (fieldType === 'crop' ? 16 : 6)"
                                        :key="n"
                                        class="px-0.5"
                                >
                                    {{ n }}
                                </option>
                            </select>
                            <div>x level</div>
                            <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                                    v-model="field.level"
                                    @change="calculateROI"
                            >
                                <option v-for="(i, n) in 21"
                                        :key="n"
                                        class="px-0.5"
                                >
                                    {{ n }}
                                </option>
                            </select>
                            <div v-if="index === calculator.fields[fieldType].length - 1"
                                 class="flex items-center pl-2"
                            >
                                <button class="bg-green-400 rounded leading-none hover:bg-green-300 p-0.5"
                                        @click="addField(fieldType)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="flex px-4 mt-4 text-sm items-center gap-2">
            <label>Gold +25%
                <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                       v-model="calculator.goldBonus"
                       @change="calculateROI"
                />
            </label>
        </div>

        <h2 class="mt-4 py-1 mx-4 font-bold">ROI</h2>
        <div class="bg-yellow-200 px-4 py-2">
            {{ roiTime }}
        </div>
    </CalculatorWrapper>
</template>
