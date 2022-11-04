<script setup>
    import ResImg from "@/components/ResImg.vue";
    import ResList from '@/components/ResList.vue'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    onBeforeMount(() => {
        handleSubmit()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const result = ref({
        lumber: 0,
        clay: 0,
        iron: 0,
        crop: 0
    })

    const handleSubmit = () => {
        const celebration = celebrationCost(calculator.party, calculator.townHall)

        result.value.lumber = calculator.production.lumber - celebration.lumber
        result.value.clay =   calculator.production.clay - celebration.clay
        result.value.iron =   calculator.production.iron - celebration.iron
        result.value.crop =   calculator.production.crop - celebration.crop
    }

    const celebrationCost = (type, level) => {
        const celebrations = {
            "small_celebration": {
                "lumber": 6400,
                "clay": 6650,
                "iron": 5940,
                "crop": 1340,
                "max_cp": 500,
                "base_time": "24:00:00"
            },
            "great_celebration": {
                "lumber": 29700,
                "clay": 33250,
                "iron": 32000,
                "crop": 6700,
                "max_cp": 2000,
                "base_time": "60:00:00"
            }
        }

        let lumber = 0
        let clay = 0
        let iron = 0
        let crop = 0

        if(type === "small") {
            let duration = celebrationDuration(celebrations.small_celebration.base_time, level)
            lumber = celebrations.small_celebration.lumber / duration
            clay = celebrations.small_celebration.clay / duration
            iron = celebrations.small_celebration.iron / duration
            crop = celebrations.small_celebration.crop / duration
        }
        if(type === "great") {
            let duration = celebrationDuration(celebrations.great_celebration.base_time, level)
            lumber = celebrations.great_celebration.lumber / duration
            clay = celebrations.great_celebration.clay / duration
            iron = celebrations.great_celebration.iron / duration
            crop = celebrations.great_celebration.crop / duration
        }

        return {
            lumber: Math.ceil(lumber),
            clay: Math.ceil(clay),
            iron: Math.ceil(iron),
            crop: Math.ceil(crop)
        }
    }

    const celebrationDuration = (base_time, level) => {
        const timesplit = base_time.split(':')
        const seconds = (+timesplit[0]) * 60 * 60 + (+timesplit[1]) * 60 + (+timesplit[2])

        return seconds * Math.pow(0.964, level - 1) / 3600
    }
</script>

<template>
    <CalculatorWrapper title="Hourly feeder traderoute" @close:calculator="close">
        <div @submit.prevent="handleSubmit" class="flex flex-col mx-2" v-on:change="handleSubmit">
            <h2 class="text-sm uppercase">Production</h2>
            <div class="flex">
                <ResImg type="lumber"></ResImg>
                <input type="text" v-model="calculator.production.lumber" alt="lumber" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>
            <div class="flex">
                <ResImg type="clay"></ResImg>
                <input type="text" v-model="calculator.production.clay" alt="clay" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>
            <div class="flex">
                <ResImg type="iron"></ResImg>
                <input type="text" v-model="calculator.production.iron" alt="iron" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>
            <div class="flex">
                <ResImg type="crop"></ResImg>
                <input type="text" v-model="calculator.production.crop" alt="crop" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>

            <label class="mt-1">
                Party:
                <select v-model="calculator.party" class="border border-gray-500 px-1">
                    <option>none</option>
                    <option>small</option>
                    <option>great</option>
                </select>
            </label>
            <label class="mt-1">
                Town Hall:
                <select v-model="calculator.townHall" class="border border-gray-500 px-1">
                    <option v-for="level in 20" v-bind:key="level">{{ level }}</option>
                </select>
            </label>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Hourly traderoute</h2>
        <ResList class="bg-yellow-200"
                 :resources="result"
        ></ResList>
    </CalculatorWrapper>
</template>
