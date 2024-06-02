<script setup>
    import ResImg from "@/components/ResImg.vue";
    import buildingsJson from '@/data/buildings.json'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const buildingsData = buildingsJson

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    onBeforeMount(() => {
        calculateCPCost()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
    }

    const modifyLevel = (building, additive) => {
        if(additive) {
            if(building.level < 20) {
                building.level++
                calculateBuildingCPCost(building)
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
            calculateBuildingCPCost(building, false)
        })

        calculator.buildings.sort((a, b) => a.resCp - b.resCp)
    }

    const calculateBuildingCPCost = (building, withSort = true) => {
        const nextLevel = getResLevel(building.name, building.level)
        const secondLevel = getResLevel(building.name, building.level + 1)
        const thirdLevel = getResLevel(building.name, building.level + 2)

        const nextCp = [nextLevel.cp, nextLevel.cp + secondLevel.cp, nextLevel.cp + secondLevel.cp + thirdLevel.cp ]
        const resCp = [
            Math.round(nextLevel.res / nextLevel.cp),
            Math.round((nextLevel.res + secondLevel.res) / nextCp[1]),
            Math.round((nextLevel.res + secondLevel.res + thirdLevel.res) / nextCp[2])
        ]

        if(resCp[0] < resCp[1]) {
            building.to = 0
            building.nextCp = nextCp[0]
            building.resCp = resCp[0]
        } else if(resCp[1] < resCp[2]) {
            building.to = building.level + 2
            building.nextCp = nextCp[1]
            building.resCp = resCp[1]
        } else {
            building.to = building.level + 3
            building.nextCp = nextCp[2]
            building.resCp = resCp[2]
        }

        if(withSort) calculator.buildings.sort((a, b) => a.resCp - b.resCp)
    }

    const getResLevel = (buildingName, level) => {
        const stats = buildingsData[buildingName][level]

        console.log(stats)

        return {
            res: stats.wood + stats.clay + stats.iron + stats.crop,
            cp: stats.cp_diff
        }
    }

</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="village">
        <div class="px-2 w-full pb-3">
            <table class="w-full">
                <tr>
                    <td class="text-center uppercase">Building</td>
                    <td class="text-center uppercase">Level</td>
                    <td class="text-center uppercase">To</td>
                    <td class="text-center uppercase">CP</td>
                    <td class="text-center uppercase pb-2">Res/CP</td>
                </tr>
                <tr v-for="building in calculator.buildings" class="border-b border-slate-400 odd:bg-slate-100">
                    <td class="px-1.5 py-1">{{ building.name }}</td>
                    <td class="">
                        <div class="flex justify-between w-14">
                            <div class="leading-none flex items-center justify-center font-bold pb-1 px-1.5 bg-slate-300 rounded cursor-pointer hover:bg-red-200" @click="modifyLevel(building, false)">-</div>
                            <div>{{ building.level }}</div>
                            <div class="leading-none flex items-center justify-center font-bold pb-0.5 px-1 bg-slate-300 rounded cursor-pointer hover:bg-emerald-200" @click="modifyLevel(building, true)">+</div>
                        </div>
                    </td>
                    <td class="px-1.5 text-right">{{ building.to ? building.to : building.level + 1}}</td>
                    <td class="px-1.5 text-right">{{ building.nextCp ? building.nextCp : '...'}}</td>
                    <td class="px-1.5 text-right">{{ building.resCp ? building.resCp : '...'}}</td>
                </tr>
            </table>
        </div>
    </CalculatorWrapper>
</template>
