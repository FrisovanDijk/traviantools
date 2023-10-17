<script setup>
    import ResList from '@/components/ResList.vue'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    onBeforeMount(() => {
        calcMerchants()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const trip = ref({
        trips: 0,
        lumber: 0,
        clay: 0,
        iron: 0,
        crop: 0
    })
    const total = ref({
        sum: 0,
        lumber: 0,
        clay: 0,
        iron: 0,
        crop: 0
    })

    const calcMerchants = () => {
        resetTotal()
        for(let i = 0; i < calculator.rows.length; i++) {
            let amount = calculator.rows[i].amount
            total.value.lumber += calculator.rows[i].lumber * amount
            total.value.clay += calculator.rows[i].clay * amount
            total.value.iron += calculator.rows[i].iron * amount
            total.value.crop += calculator.rows[i].crop * amount
            total.value.sum = total.value.lumber + total.value.clay + total.value.iron + total.value.crop
        }

        const capacity = calculator.merchants * calculator.capacity
        const trips = Math.ceil(total.value.sum / capacity)

        trip.value = {
            trips: trips,
            lumber: total.value.lumber / trips,
            clay: total.value.clay / trips,
            iron: total.value.iron / trips,
            crop: total.value.crop / trips
        }
    }

    const addRow = () => {
        const newRow = {
            amount: 1,
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }
        calculator.rows.push(newRow)
    }

    const resetTotal = () => {
        total.value = {
            sum: 0,
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }
    }

    const resetRows = () => {
        calculator.rows = []
        addRow()
        calcMerchants()
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close">
        <div class="flex-grow flex flex-col" @change="calcMerchants">
            <div class="flex-grow flex flex-col">
                <div class="flex justify-between px-6">
                    <span class="mr-2">#</span>
                    <ResImg type="lumber"></ResImg>
                    <ResImg type="clay"></ResImg>
                    <ResImg type="iron"></ResImg>
                    <ResImg type="crop"></ResImg>
                </div>
                <div class="flex justify-between px-2 pb-1"
                     v-for="(row, index) in calculator.rows"
                     :key="index"
                >
                    <input type="text" v-model="row.amount" style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm mr-2">
                    <input type="text" v-model="row.lumber" style="width: 3.3rem; padding: 0 0.1rem; background-color: rgb(255,222,173)" class="pl-1 border border-gray-300 text-sm">
                    <input type="text" v-model="row.clay"   style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm bg-red-200">
                    <input type="text" v-model="row.iron"   style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm bg-gray-200">
                    <input type="text" v-model="row.crop"   style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm bg-yellow-200">
                </div>

                <div class="flex justify-end mt-1 mx-2">
                    <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetRows">reset</button>
                    <button class="bg-green-600 hover:bg-green-400 px-2 pb-1 rounded text-md text-white" @click="addRow">add row</button>
                </div>
            </div>

            <label class="mt-2 mx-2 flex items-baseline">
                Merchants:
                <select v-model="calculator.merchants" class="border border-gray-500 px-1 ml-1">
                    <option v-for="available in 20" :key="available">{{ available }}</option>
                </select>
            </label>
            <label class="mt-2 mx-2 flex items-baseline">
                Capacity:
                <input type="text" v-model="calculator.capacity" class="border border-gray-600 rounded-sm px-2 ml-1 w-16">
            </label>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Merchant trips</h2>
        <div class="bg-yellow-200">
            <div class="px-3 py-1"><span class="font-bold">{{ trip.trips }}</span> trips of</div>
            <ResList :resources="trip" class="pt-0"></ResList>
        </div>
    </CalculatorWrapper>
</template>
