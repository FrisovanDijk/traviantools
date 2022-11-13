<script setup>
    import ResImg from "@/components/ResImg.vue";
    import ResList from '@/components/ResList.vue'
    import buildingsJson from '@/data/buildings.json'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const buildings = buildingsJson

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    onBeforeMount(() => {
        if(calculator.selections.length < 1) {
            calculator.selections.push({
                amount: 1,
                name: 'Barracks',
                fromLevel: 0,
                toLevel: 1
            })
        }
        updateTotals()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const total = ref({
        lumber: 0,
        clay: 0,
        iron: 0,
        crop: 0,
        cp: 0,
        cpRes: 0
    })

    const addSelection = () => {
        calculator.selections.push({
            amount: 1,
            name: 'Barracks',
            fromLevel: 0,
            toLevel: 1
        })
        updateTotals()
    }

    const removeSelection = (selection) => {
        calculator.selections.splice(calculator.selections.indexOf(selection), 1)
    }

    const updateTotals = () => {
        const localTotal = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0,
            cp: 0,
            cpRes: 0
        }

        for(let i = 0; i < calculator.selections.length; i++) {
            const subtotal = {
                lumber: 0,
                clay: 0,
                iron: 0,
                crop: 0,
                cp: 0,
                cpRes: 0
            }

            const item = calculator.selections[i]
            if(Number(item.toLevel) <= Number(item.fromLevel)) item.toLevel = Number(item.fromLevel)+1

            for(let j = item.fromLevel; j <= item.toLevel - 1; j++) {
                const res = buildings[item.name][j]
                subtotal.lumber += res.wood
                subtotal.clay += res.clay
                subtotal.iron += res.iron
                subtotal.crop += res.crop
                subtotal.cp += res.cp_diff
            }

            localTotal.lumber += subtotal.lumber * item.amount
            localTotal.clay   += subtotal.clay * item.amount
            localTotal.iron   += subtotal.iron * item.amount
            localTotal.crop   += subtotal.crop * item.amount
            localTotal.cp     += subtotal.cp * item.amount
        }

        localTotal.cpRes = Math.round(((localTotal.lumber + localTotal.clay + localTotal.iron + localTotal.crop) / localTotal.cp)*100)/100

        total.value = localTotal
    }
</script>

<template>
    <CalculatorWrapper title="Building cost" @close:calculator="close">
        <table class="text-sm mx-2">
            <tr class="uppercase pb-1">
                <th class="font-normal">#</th>
                <th class="font-normal">Building</th>
                <th class="font-normal">From</th>
                <th class="font-normal">To</th>
                <th class="font-normal"></th>
            </tr>
            <tr v-for="(selection, index) in calculator.selections"
                :key="index"
                @change="updateTotals"
            >
                <td>
                    <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                            v-model="selection.amount"
                    >
                        <option v-for="n in 15"
                                :key="n"
                        >
                            {{ n }}
                        </option>
                    </select>
                </td>

                <td>
                    <select class="w-32 border-gray-600 border mr-1 text-sm"
                            v-model="selection.name"
                    >
                        <option v-for="(building,key) in buildings"
                                :key="key"
                                :selected="selection.name === key"
                        >
                            {{ key }}
                        </option>
                    </select>
                </td>

                <td>
                    <select class="border border-gray-600 w-10 flex-shrink-0 text-sm mr-1"
                            v-model="selection.fromLevel"
                    >
                        <option v-for="(level,key) in buildings[selection.name]"
                                :key="key"
                                :selected="selection.name === key"
                        >
                            {{ level.level - 1 }}
                        </option>
                    </select>
                </td>

                <td>
                    <select class="border border-gray-600 w-10 flex-shrink-0 text-sm"
                            v-model="selection.toLevel"
                    >
                        <option v-for="(level,key) in buildings[selection.name]"
                                :key="key"
                                :selected="selection.name === key"
                        >
                            {{ level.level }}
                        </option>
                    </select>
                </td>

                <td>
                    <button class="bg-red-400 rounded leading-none hover:bg-red-300 p-0.5 ml-0.5"
                            @click="removeSelection(selection)"
                            v-if="calculator.selections.length > 1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                        </svg>
                    </button>
                </td>
            </tr>
        </table>

        <div class="flex justify-end mt-2 mx-2 space-x-2">
            <button class="bg-green-400 rounded leading-none hover:bg-green-300 p-0.5"
                    @click="addSelection"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>


        <h2 class="mt-2 py-1 mx-2 font-bold">Total sum</h2>
        <ResList class="bg-yellow-200"
                 :resources="total"
                 :total="true"
        ></ResList>
        <div class="bg-yellow-200 p-2 pt-0">
            <div class="flex">+{{total.cp}} CP. <ResImg class="-mr-1" type="resources"></ResImg>/CP: {{ total.cpRes }}</div>
        </div>
    </CalculatorWrapper>
</template>
