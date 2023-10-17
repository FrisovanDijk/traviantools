<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import troopsJson from '@/data/troops.json'
    import { userData } from '@/stores/userData.js'
    import ResImg from '@/components/ResImg.vue'

    const props = defineProps({
        index: Number
    })
    const troops = troopsJson

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    const getCost = () => {
        const mod_trainer = 1 - (calculator.artifact / 100)
        const mod_bonus = 1 - (calculator.recruitment / 100)

        const helm_inf = 1 + calculator.helm_inf / 100
        const helm_cav = 1 + calculator.helm_cav / 100

        const time_inf_mod = Math.pow(0.9,20 - 1) * mod_trainer * mod_bonus / helm_inf
        const time_cav_mod = Math.pow(0.9,20 - 1) * mod_trainer * mod_bonus / helm_cav
        const time_siege_mod = Math.pow(0.9,20 - 1) * mod_trainer * mod_bonus

        if(!calculator.units.length) return false

        let cost = {
            time_inf: 0,
            time_cav: 0,
            time_siege: 0,
            time_hospital: 0,
            wood: 0,
            clay: 0,
            iron: 0,
            crop: 0,
            total_res: 0
        }

        calculator.units.forEach((row) => {
            const unit = troops[calculator.tribe].filter((e) => {return e.name === row.name})[0]
            if(!unit) return false
            const unit_time = unit.training_time.split(':')
            unit.seconds = Number(unit_time[0]) * 3600 + Number(unit_time[1]) * 60 + Number(unit_time[2])

            if(unit.type === 'inf') { cost.time_inf += unit.seconds * time_inf_mod * row.amount }
            if(unit.type === 'cav') { cost.time_cav += unit.seconds * time_cav_mod * row.amount }
            if(unit.type === 'siege') { cost.time_siege += unit.seconds * time_siege_mod * row.amount }
            if(unit.type === 'inf' || unit.type === 'cav') { cost.time_hospital += Math.pow(0.9,calculator.hospital_level - 1) * unit.seconds * row.amount / 2 }
            cost.wood += unit.wood * row.amount
            cost.clay += unit.clay * row.amount
            cost.iron += unit.iron * row.amount
            cost.crop += unit.crop * row.amount
        })

        cost.time_inf = Math.round(cost.time_inf / 3600)
        cost.time_cav = Math.round(cost.time_cav / 3600)
        cost.time_siege = Math.round(cost.time_siege / 3600)
        cost.time_hospital = Math.round(cost.time_hospital / 3600)

        cost.total_res = cost.wood + cost.clay + cost.iron + cost.crop
        cost.no_crop = cost.wood + cost.clay + cost.iron

        return cost
    }

    const getUnits = () => {
        return troops[calculator.tribe].filter((e) => {return e.type === 'inf' || e.type === 'cav' || e.type === 'siege'})
    }

    const resetRows = () => {
        calculator.units = []
        addRow()
    }

    const addRow = () => {
        const newRow = {
            amount: 1,
            name: ''
        }
        calculator.units.push(newRow)
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close">
        <div class="flex flex-col">
            <label class="px-4 mt-2">
                Tribe
                <select v-model="calculator.tribe" class="border border-gray-500 px-1 ml-1">
                    <option v-for="tribe in ['gaul', 'teutons', 'romans', 'egyptians', 'huns']" v-bind:key="tribe">{{ tribe }}</option>
                </select>
            </label>
            <label class="px-4 mt-2">
                Recruitment bonus
                <select v-model="calculator.recruitment" class="border border-gray-500 px-1 ml-1">
                    <option v-for="bonus in [0,2,4,6,8,10]" v-bind:key="bonus">{{ bonus }}</option>
                </select>
            </label>
            <label class="px-4 mt-2">
                Artifact
                <select v-model="calculator.artifact" class="border border-gray-500 px-1 ml-1">
                    <option v-for="arti in [0,25,50]" v-bind:key="arti">{{ arti }}</option>
                </select>
            </label>
            <label class="px-4 mt-2">
                Infantry helm
                <select v-model="calculator.helm_inf" class="border border-gray-500 px-1 ml-1">
                    <option v-for="helmet in [0,10,15,20]" v-bind:key="helmet">{{ helmet }}</option>
                </select>
            </label>
            <label class="px-4 mt-2">
                Cavalry helm
                <select v-model="calculator.helm_cav" class="border border-gray-500 px-1 ml-1">
                    <option v-for="helmet in [0,10,15,20]" v-bind:key="helmet">{{ helmet }}</option>
                </select>
            </label>
            <label class="px-4 mt-2">
                Hospital level
                <select v-model="calculator.hospital_level" class="border border-gray-500 px-1 ml-1">
                    <option v-for="(level, index) in 21" v-bind:key="level">{{ index }}</option>
                </select>
            </label>

            <div class="flex flex-col gap-1 px-2 mt-4 mb-1">
                <div class="flex"
                     v-for="(row, index) in calculator.units"
                     :key="index"
                >
                    <input type="number" v-model="row.amount" min="0" class="py-0.5 px-1 border border-gray-300 w-24">
                    <select v-model="row.name" class="border border-gray-500 px-1 py-0.5 ml-2 w-full">
                        <option v-for="(unit, index) in getUnits()" v-bind:key="level">{{ unit.name }}</option>
                    </select>
                </div>
            </div>


            <div class="flex justify-end mt-1 mx-2">
                <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetRows">reset</button>
                <button class="bg-green-600 hover:bg-green-400 px-2 pb-1 rounded text-md text-white" @click="addRow">add row</button>
            </div>

            <h2 class="mt-2 py-1 mx-2 font-bold">Total cost</h2>
            <div class="bg-yellow-200 p-2">
                <template v-if="getCost()">
                    <template v-if="getCost().time_inf">Barracks time: {{ getCost().time_inf }} hours</template>
                    <template v-if="getCost().time_cav"><br/>Stables time: {{ getCost().time_cav }} hours</template>
                    <template v-if="getCost().time_siege"><br/>Workshop time: {{ getCost().time_siege }} hours</template>
                    <template v-if="getCost().time_hospital"><br/>Hospital time: {{ getCost().time_hospital }} hours</template>

                    <br/>
                    <div class="flex flex-wrap gap-1 mt-2">
                        <div class="flex"><ResImg type="lumber" /> {{ getCost().wood }}</div>
                        <div class="flex"><ResImg type="clay" /> {{ getCost().clay }}</div>
                        <div class="flex"><ResImg type="iron" /> {{ getCost().iron }}</div>
                        <div class="flex"><ResImg type="crop" /> {{ getCost().crop }}</div>
                    </div>
                    <div class="flex justify-between gap-1 mt-2">
                        <div class="flex"><ResImg type="resources" /> {{ getCost().total_res }}</div>
                        <div class="flex"><ResImg type="nocrop" /> {{ getCost().no_crop }}</div>
                    </div>
                </template>
                <div v-else>
                    Select troops
                </div>
            </div>
        </div>

    </CalculatorWrapper>
</template>
