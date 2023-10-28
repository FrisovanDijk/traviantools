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
    const nextSelection = ref('Granary')
    const buildingsForm = () => {
        const {"Main Building": _, ...newList} = buildings
        delete newList["Rally Point"]
        delete newList["Cropland"]
        delete newList["Clay Pit"]
        delete newList["Iron Mine"]
        delete newList["Woodcutter"]
        calculator.selections.forEach((e) => {
            delete newList[e.name]
        })
        return newList
    }

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    onBeforeMount(() => {
        updateTotals()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
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
            name: nextSelection.value,
            toLevel: buildings[nextSelection.value].length,
            editable: true
        })
        const newForm = buildingsForm()
        nextSelection.value = Object.keys(newForm)[0]
        updateTotals()
    }

    const removeSelection = (selection) => {
        calculator.selections.splice(calculator.selections.indexOf(selection), 1)
        updateTotals()
    }

    const updateTotals = () => {
        const localTotal = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0,
            cp: 0,
            cpRes: 0,
            pop: 0
        }

        for(let i = 0; i < calculator.selections.length; i++) {
            const subtotal = {
                lumber: 0,
                clay: 0,
                iron: 0,
                crop: 0,
                cp: 0,
                cpRes: 0,
                pop: 0
            }

            const item = calculator.selections[i]

            if(item.name === 'Res buildings 5, bakery 4') {
                subtotal.lumber += 51385 / 5
                subtotal.clay += 56720 / 5
                subtotal.iron += 43880 / 5
                subtotal.crop += 52540 / 5
                subtotal.cp += 10 / 5
                subtotal.pop += 62 / 5
            } else {
                for(let j = 0; j <= item.toLevel - 1; j++) {
                    const res = buildings[item.name][j]
                    subtotal.lumber += res.wood
                    subtotal.clay += res.clay
                    subtotal.iron += res.iron
                    subtotal.crop += res.crop
                    subtotal.cp += res.cp_diff
                    subtotal.pop += res.pop
                }
            }

            localTotal.lumber += subtotal.lumber * item.amount
            localTotal.clay   += subtotal.clay * item.amount
            localTotal.iron   += subtotal.iron * item.amount
            localTotal.crop   += subtotal.crop * item.amount
            localTotal.cp     += subtotal.cp * item.amount
            localTotal.pop    += subtotal.pop * item.amount
        }

        localTotal.cpRes = Math.round(((localTotal.lumber + localTotal.clay + localTotal.iron + localTotal.crop) / localTotal.cp)*100)/100

        total.value = localTotal
    }

    const moreThanOne = (building) => {
        return building === 'Granary' || building === "Warehouse" || building === "Cranny"
            || building === "Trapper" || building === "Great Granary" || building === "Great Warehouse"
    }

    const buildingCount = () => {
        let count = 0
        calculator.selections.forEach((e) => { count += Number(e.amount)})
        return count
    }

    const maxAmount = (amount) => {
        const freeSlots = 21 - buildingCount()
        return Number(amount) + freeSlots
    }

    const setPreset = (preset) => {

        const newSelections = [
            { amount: 1, name: "Main Building", toLevel: 20, editable: false },
            { amount: 1, name: "Rally Point", toLevel: 10, editable: false }
        ]

        if(preset === 'Capital lv19') {
            newSelections.push({ amount: 12, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 3, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Trade Office", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Grain Mill", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Bakery", toLevel: 5, editable: true })
        }

        if(preset === 'Storage') {
            newSelections.push({ amount: 5, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 11, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Trade Office", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Town Hall", toLevel: 10, editable: true })
        }

        if(preset === 'Hammer') {
            newSelections.push({ amount: 3, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 4, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Barracks", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Great Barracks", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Stable", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Great Stable", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Workshop", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Palace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Hospital", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Tournament Square", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Treasury", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Town Hall", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Palisade", toLevel: 20, editable: true })
        }

        if(preset === 'Anvil') {
            newSelections.push({ amount: 2, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 3, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Barracks", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Stable", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Workshop", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Hospital", toLevel: 15, editable: true })
            newSelections.push({ amount: 1, name: "Tournament Square", toLevel: 15, editable: true })
            newSelections.push({ amount: 1, name: "Residence", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Town Hall", toLevel: 10, editable: true })
            newSelections.push({ amount: 5, name: "Res buildings 5, bakery 4", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Palisade", toLevel: 20, editable: true })
        }

        if(preset === '500 CP feeder') {
            newSelections[1].toLevel = 2
            newSelections.push({ amount: 1, name: "Warehouse", toLevel: 14, editable: true })
            newSelections.push({ amount: 1, name: "Granary", toLevel: 14, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Barracks", toLevel: 3, editable: true })
            newSelections.push({ amount: 1, name: "Stable", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Workshop", toLevel: 1, editable: true })
            newSelections.push({ amount: 1, name: "Smithy", toLevel: 3, editable: true })
            newSelections.push({ amount: 1, name: "Residence", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Academy", toLevel: 15, editable: true })
            newSelections.push({ amount: 1, name: "Embassy", toLevel: 15, editable: true })
            newSelections.push({ amount: 1, name: "Town Hall", toLevel: 1, editable: true })
            newSelections.push({ amount: 1, name: "Hero's Mansion", toLevel: 10, editable: true })
            newSelections.push({ amount: 5, name: "Res buildings 5, bakery 4", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Palisade", toLevel: 3, editable: true })
        }

        if(preset === '750 CP feeder') {
            newSelections.push({ amount: 1, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Trade Office", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Barracks", toLevel: 3, editable: true })
            newSelections.push({ amount: 1, name: "Stable", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Smithy", toLevel: 3, editable: true })
            newSelections.push({ amount: 1, name: "Academy", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Embassy", toLevel: 19, editable: true })
            newSelections.push({ amount: 1, name: "Residence", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Town Hall", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Hero's Mansion", toLevel: 10, editable: true })
            newSelections.push({ amount: 5, name: "Res buildings 5, bakery 4", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Palisade", toLevel: 10, editable: true })
        }

        if(preset === '1000 CP feeder') {
            newSelections[1].toLevel = 20
            newSelections.push({ amount: 2, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 3, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Trade Office", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Stable", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Academy", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Embassy", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Residence", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Hero's Mansion", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Town Hall", toLevel: 13, editable: true })
            newSelections.push({ amount: 5, name: "Res buildings 5, bakery 4", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Palisade", toLevel: 10, editable: true })
        }

        if(preset === 'Infantry/WW Anvil') {
            newSelections.push({ amount: 2, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 3, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Barracks", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Smithy", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Hospital", toLevel: 15, editable: true })
            newSelections.push({ amount: 1, name: "Academy", toLevel: 10, editable: true })
            newSelections.push({ amount: 1, name: "Residence", toLevel: 10, editable: true })
            newSelections.push({ amount: 5, name: "Res buildings 5, bakery 4", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Palisade", toLevel: 10, editable: true })
        }

        if(preset === '9c cap lv18') {
            newSelections.push({ amount: 7, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 4, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Trade Office", toLevel: 16, editable: true })
            newSelections.push({ amount: 1, name: "Stonemason's Lodge", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Grain Mill", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Bakery", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Sawmill", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Brickyard", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Iron Foundry", toLevel: 5, editable: true })
        }

        if(preset === '15c cap lv18') {
            newSelections.push({ amount: 7, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 7, name: "Granary", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Marketplace", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Trade Office", toLevel: 16, editable: true })
            newSelections.push({ amount: 1, name: "Stonemason's Lodge", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Grain Mill", toLevel: 5, editable: true })
            newSelections.push({ amount: 1, name: "Bakery", toLevel: 5, editable: true })
        }

        if(preset === 'No preset') {
            newSelections.push({ amount: 1, name: "Warehouse", toLevel: 20, editable: true })
            newSelections.push({ amount: 1, name: "Granary", toLevel: 20, editable: true })
        }

        calculator.selections = newSelections
        updateTotals()
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="village">
        <div class="flex px-2">
            <select class="border border-gray-600 px-2 py-1 mx-auto w-48 text-center"
                    v-model="calculator.preset"
                    @change="setPreset(calculator.preset)"
            >
                <option v-for="n in ['No preset', 'Hammer', 'Anvil', 'Storage', '500 CP feeder', '750 CP feeder', '1000 CP feeder', 'Infantry/WW Anvil', 'Capital lv19', '15c cap lv18', '9c cap lv18']">
                    {{ n }}
                </option>
            </select>
        </div>

        <table class="table-fixed mx-2 mt-2 border-spacing-1 border-separate"
               @change="updateTotals()"
        >
            <tr>
                <th>#</th>
                <th class="w-full">{{ buildingCount() }}/21 buildings</th>
                <th>Lvl</th>
                <th class="w-6">&nbsp;</th>
            </tr>
            <tr v-for="(selection, index) in calculator.selections"
                :key="index"
            >
                <td>
                    <select class="border border-gray-600 px-1"
                            v-model="selection.amount"
                            v-if="moreThanOne(selection.name)"
                    >
                        <option v-for="n in maxAmount(selection.amount)"
                                :key="n"
                        >
                            {{ n }}
                        </option>
                    </select>
                    <div v-else class="border bg-gray-100 px-2">1</div>
                </td>
                <td>
                    <div class="border bg-gray-100 px-2"
                    >
                        {{ selection.name }}
                    </div>
                </td>
                <td>
                    <select class="border border-gray-600 px-1 w-14"
                            v-model="selection.toLevel"
                    >
                        <option v-for="n in buildings[selection.name].length"
                                :key="n"
                                v-if="selection.name !== 'Res buildings 5, bakery 4'"
                        >
                            {{ n }}
                        </option>
                        <option v-else>5</option>
                    </select>
                </td>
                <td>
                    <button class="bg-red-400 rounded leading-none hover:bg-red-300 p-0.5 self-end"
                            @click="removeSelection(selection)"
                            v-if="selection.editable"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                        </svg>
                    </button>
                </td>
            </tr>
        </table>

        <div class="flex gap-2 justify-end mt-4 mx-2 space-x-2" v-if="buildingCount() < 21">
            <select class="border-gray-600 border mr-1 text-sm px-2" v-model="nextSelection">
                <option v-for="(building,key) in buildingsForm()"
                        :key="key"
                        :selected="nextSelection === key"
                >
                    {{ key }}
                </option>
            </select>
            <button class="bg-green-400 rounded leading-none hover:bg-green-300 px-4 py-0.5"
                    @click="addSelection"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Village stats</h2>
        <ResList class="bg-yellow-200"
                 :resources="total"
                 :total="true"
        ></ResList>
        <div class="bg-yellow-200 p-2 pt-0">
            <div class="flex">+{{total.pop}} pop. +{{total.cp}} CP. <ResImg class="-mr-1" type="resources"></ResImg>/CP: {{ total.cpRes }}</div>
            <div class="flex mt-1 text-xs">{{total.cp + 108}} CP, including fields lv10</div>
        </div>
    </CalculatorWrapper>
</template>
