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

    let calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
    console.log(userData.tabs[userData.currentTab])
    console.log(props.index)
    console.log(calculator)

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

    const resetRows = () => {
        calculator.selections = [{
            amount: 1,
            name: 'Barracks',
            fromLevel: 0,
            toLevel: 1
        }]
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
    <CalculatorWrapper title="Building cost" @close:view="$emit('close:view')">
        <div class="flex justify-between text-sm uppercase mb-1 px-2">
            <div class="flex"><div class="mr-8 pr-1">#</div>Building</div>
            <div class="flex"><div class="mr-6 pr-1">From</div>To</div>
        </div>
        <div v-for="(selection, index) in calculator.selections"
             :key="index"
             class="flex mb-2 justify-between px-2"
             @change="updateTotals"
        >

            <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                    v-model="selection.amount"
            >
                <option v-for="n in 15"
                        :key="n"
                >
                    {{ n }}
                </option>
            </select>

            <select class="w-40 border-gray-600 border mr-1 text-sm"
                    v-model="selection.name"
            >
                <option v-for="(building,key) in buildings"
                        :key="key"
                        :selected="selection.name === key"
                >
                    {{ key }}
                </option>
            </select>

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
        </div>

        <div class="flex justify-end mt-1 mx-2">
            <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetRows">reset</button>
            <button class="bg-green-600 hover:bg-green-400 px-2 pb-1 rounded text-md text-white" @click="addSelection">add row</button>
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
