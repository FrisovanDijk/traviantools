<script setup>
    import buildingsJson from '@/data/buildings.json'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const buildingsData = buildingsJson

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    const tab = ref(0)
    const resi = ref(true)

    onBeforeMount(() => {
        calculateCPCost()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
    }

    const modifyLevel = (building, additive) => {
        if(additive) {
            if((building.name !== "Cranny" && building.level < 19) || building.level < 9) {
                building.level++
                calculateBuildingCPCost(building)
            } else {
                if(building.name === "Cranny") building.level = 10
                if(building.name !== "Cranny") building.level = 20
                building.res = 0
                building.to = building.level
                building.cp = 0
                building.resCp = 0
            }
        } else {
            if(building.level > 0) {
                building.level--
                calculateBuildingCPCost(building)
            }
        }


    }

    const calculateCPCost = () => {
        calculator.buildings.forEach((building) => {
            if((building.name !== "Cranny" && building.level < 19) || building.level < 9) {
                calculateBuildingCPCost(building)
            } else {
                if(building.name === "Cranny") building.level = 10
                if(building.name !== "Cranny") building.level = 20
                building.res = 0
                building.to = building.level
                building.cp = 0
                building.resCp = 0
            }
        })
    }

    const calculateBuildingCPCost = (building) => {
        const nextLevel = getResLevel(building.name, building.level)
        const nextCp = [nextLevel.cp]
        const nextRes = [nextLevel.res]
        const resCp = [Math.round(nextRes[0] / nextCp[0])]

        if((building.name !== "Cranny" && building.level + 1 < 20) || building.level + 1 < 10) {
            const secondLevel = getResLevel(building.name, building.level + 1)

            nextCp.push(nextCp[0] + secondLevel.cp)
            nextRes.push(nextRes[0] + secondLevel.res)
            resCp.push(Math.round(nextRes[1] / nextCp[1]))
        } else {
            nextCp.push(nextCp[0])
            nextRes.push(nextRes[0])
            resCp.push(Math.round(nextRes[1] / nextCp[1]) + 1)
        }

        if((building.name !== "Cranny" && building.level + 2 < 20) || building.level + 2 < 10) {
            const thirdLevel = getResLevel(building.name, building.level + 2)

            nextCp.push(nextCp[1] + thirdLevel.cp)
            nextRes.push(nextRes[1] + thirdLevel.res)
            resCp.push(Math.round(nextRes[2] / nextCp[2]) + 1)
        } else {
            nextCp.push(nextCp[1])
            nextRes.push(nextRes[1])
            resCp.push(Math.round(nextRes[2] / nextCp[2]))
        }

        if(resCp[1] > 0 && resCp[0] <= resCp[1] && resCp[0] !== resCp[1]) {
            building.to = building.level + 1
            building.nextCp = nextCp[0]
            building.res = nextRes[0]
            building.resCp = resCp[0]
        } else if(resCp[2] > 0 && resCp[1] <= resCp[2]) {
            building.to = building.level + 2
            building.nextCp = nextCp[1]
            building.res = nextRes[1]
            building.resCp = resCp[1]
        } else {
            building.to = building.level + 3
            building.nextCp = nextCp[2]
            building.res = nextRes[2]
            building.resCp = resCp[2]
        }
    }

    const getResLevel = (buildingName, level) => {
        try {
            const stats = buildingsData[buildingName][level]

            return {
                res: stats.wood + stats.clay + stats.iron + stats.crop,
                cp: stats.cp_diff
            }
        } catch (e) {
            return {
                res: 1,
                cp: 0
            }
        }
    }

    const sortCPCost = () => {
        calculator.buildings.sort((a, b) => a.resCp - b.resCp)
    }

    const sortBuildingName = () => {
        calculator.buildings.sort((a, b) => {
            if ( a.name < b.name ){
                return -1;
            }
            if ( a.name > b.name ){
                return 1;
            }
            return 0;
        })
    }

    // tab 0    Res/CP
    // tab 1    CP and Res
    // tab 2    Free edit of levels
    const swapTab = (key) => {
        // swap away from current tab edit means recalculating
        if(tab.value === 2)  calculateCPCost()

        if(key === 1) {
            if(tab.value === 0) tab.value = 1
            else if(tab.value === 1) tab.value = 0
            else tab.value = 0
        }

        if(key === 2) {
            if(tab.value === 0 || tab.value === 1) tab.value = 2
            else tab.value = 0
        }
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="village">
        <div class="px-2 w-full pb-3">
            <div class="flex gap-2 text-xs">

                <button class="leading-none flex items-center justify-center gap-1 pb-1.5 pt-1 px-2 bg-slate-300 rounded cursor-pointer hover:bg-emerald-200" @click="swapTab(1)">
                    <div>{{ $t('data') }}</div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-m-0.5 w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                    </div>
                </button>

                <button class="leading-none flex items-center justify-center gap-1 pb-1.5 pt-1 px-2 bg-slate-300 rounded cursor-pointer hover:bg-emerald-200" @click="swapTab(2)">
                    <div>{{ $t('edit') }}</div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-m-0.5 w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </div>
                </button>

            </div>
            <table class="w-full mt-2">
                <tr>
                    <td class="text-center uppercase pb-1">
                        <div class="flex items-center justify-center gap-1 cursor-pointer" @click="sortBuildingName()">
                            <div>{{$t('building')}}</div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-m-0.5 w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                </svg>
                            </div>
                        </div>
                    </td>
                    <td class="text-center uppercase pb-1">{{$t('level')}}</td>
                    <td class="text-center uppercase pb-1" v-if="tab === 0 || tab === 1">{{ $t('to')}}</td>

                    <template v-if="tab === 0">
                        <td class="text-center uppercase pb-1">
                            <div class="flex items-center justify-center gap-1 cursor-pointer" @click="sortCPCost()">
                                <div>{{$t('res_per_cp')}}</div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-m-0.5 w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                    </svg>
                                </div>
                            </div>
                        </td>
                    </template>

                    <template v-if="tab === 1">
                        <td class="text-center uppercase pb-1">{{$t('res')}}</td>
                        <td class="text-center uppercase pb-1">{{$t('cp_short')}}</td>
                    </template>
                </tr>

                <template v-for="building in calculator.buildings">

                    <tr class="border-b border-slate-400 odd:bg-slate-100"
                            v-if="(building.name === 'Residence' && resi) || (building.name === 'Palace' && !resi) || (building.name !== 'Residence' && building.name !== 'Palace')"
                    >
                        <td class="px-1.5 py-1" v-if="building.name === 'Residence' || building.name === 'Palace'">
                            <div class="flex items-center gap-2 cursor-pointer" @click="resi = !resi">
                                <div>{{ $t(`buildings.${building.name}`) }}</div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-m-0.5 w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                </div>
                            </div>
                        </td>

                        <td class="px-1.5 py-1" v-else>
                            {{ $t(`buildings.${building.name}`) }}
                        </td>

                        <template v-if="tab === 0 || tab === 1">
                            <td class="">
                                <div class="flex justify-between w-14">
                                    <div class="leading-none flex items-center justify-center font-bold pb-1 px-1.5 bg-slate-300 rounded cursor-pointer hover:bg-red-200" @click="modifyLevel(building, false)">-</div>
                                    <div>{{ building.level }}</div>
                                    <div class="leading-none flex items-center justify-center font-bold pb-0.5 px-1 bg-slate-300 rounded cursor-pointer hover:bg-emerald-200" @click="modifyLevel(building, true)">+</div>
                                </div>
                            </td>
                            <td class="px-1.5 text-right">{{ building.to ? building.to : building.level + 1}}</td>

                            <template v-if="tab === 0">
                                <td class="px-1.5 text-right">{{ building.resCp ? building.resCp : '...'}}</td>
                            </template>

                            <template v-if="tab === 1">
                                <td class="text-right px-1.5">{{ building.res ? building.res : '...'}}</td>
                                <td class="text-right px-1.5">{{ building.nextCp ? building.nextCp : '...'}}</td>
                            </template>
                        </template>

                        <template v-if="tab === 2">
                            <td class="text-right">
                                <input type="number" class="py-0.5 px-1 border border-gray-300 w-14" v-model="building.level" min="0" :max="building.name === 'Cranny' ? 9 : 19">
                            </td>
                        </template>

                    </tr>

                </template>

            </table>
        </div>
    </CalculatorWrapper>
</template>
