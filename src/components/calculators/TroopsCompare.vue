<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import troopsJson from '@/data/troops.json'
    import buildingsJson from '@/data/buildings.json'
    import { userData } from '@/stores/userData.js'
    import ResImg from '@/components/ResImg.vue'
    import { ref, onBeforeMount } from 'vue'

    const props = defineProps({
        index: Number
    })
    const troops = troopsJson
    const buildings = buildingsJson

    onBeforeMount(() => {
        compareTroops()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
    const upgradeEfficiency = ref([])

    const compareTroops = () => {

    }

    const getUnits = () => {
        return troops[calculator.tribe].filter((e) => {return e.type === 'inf' || e.type === 'cav' || e.type === 'siege'})
    }

    const getUnitShort = (name) => {
        if(calculator.tribe === 'egyptians' || calculator.tribe === 'teutons' || calculator.tribe === 'huns') return name
        return calculator.tribe === 'romans' && name.split(" ")[1] ? name.split(" ")[1] : name.split(" ")[0]
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close">
        <div class="flex flex-col" @change="compareTroops">
            <label class="px-4 mt-2">
                Tribe
                <select v-model="calculator.tribe" class="border border-gray-500 px-1 ml-1">
                    <option v-for="tribe in ['gaul', 'teutons', 'romans', 'egyptians', 'huns']" v-bind:key="tribe">{{ tribe }}</option>
                </select>
            </label>

            <h2 class="mt-2 py-1 mx-2 font-bold">Break even for lv{{calculator.level}}</h2>
            <div class="bg-yellow-200 p-2 flex flex-wrap">
                <div class="">Select a unit</div>
            </div>
        </div>
    </CalculatorWrapper>
</template>
