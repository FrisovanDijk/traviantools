<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import ResImg from '@/components/ResImg.vue'
    import VillageTypeSelector from '@/components/VillageTypeSelector.vue'
    import OasisSelector from '@/components/OasisSelector.vue'
    import RadioSelect from "@/components/RadioSelect.vue"

    import buildingsJson from '@/data/buildings.json'
    import productionJson from '@/data/production.json'
    import village_types from '@/data/village_types.json'

    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    // Variables
    const villageTypes = village_types

    onBeforeMount(() => {
        // calculateROI() No sim before mount here I guess
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const updateOasis = (data) => { calculator.oases[data.i-1] = data.type}
    const updateVillageType = (data) => { calculator.villagetype = data.type}
    const updateSimTo = (data) => { calculator.simTo = data}

    const simROIBuild = () => {
        const fields = {
            crop: [],
            clay: [],
            lumber: [],
            iron: []
        }
        let memory = []
        const build = []

        // Create fields
        for(let i = 0; i < calculator.villagetype.crop; i++) {
            fields.crop.push({
                id: i,
                type: 'crop',
                level: 0
            })
        }
        for(let i = 0; i < calculator.villagetype.lumber; i++) {
            fields.lumber.push({
                id: i,
                type: 'lumber',
                level: 0
            })
        }
        for(let i = 0; i < calculator.villagetype.clay; i++) {
            fields.clay.push({
                id: i,
                type: 'clay',
                level: 0
            })
        }
        for(let i = 0; i < calculator.villagetype.iron; i++) {
            fields.iron.push({
                id: i,
                type: 'iron',
                level: 0
            })
        }

        // First run ROI steps on fields
        memory.push(calculateFieldROI(fields.crop))
        memory.push(calculateFieldROI(fields.lumber))
        memory.push(calculateFieldROI(fields.clay))
        memory.push(calculateFieldROI(fields.iron))

        // Start simulation
        let running = true
        let count = 0
        while(running) {

            // Select lowest ROI
            const lowROI = memory.reduce((curr, prev) => (curr.roi <= prev.roi) ? curr : prev)
            console.log(lowROI.type + ' to ' + lowROI.level)
            build.push(lowROI)

            if(lowROI.type === 'crop' || lowROI.type === 'lumber' || lowROI.type === 'clay' || lowROI.type === 'iron' ) {
                fields[lowROI.type].every((field) => {
                    if(field.id === lowROI.id) {
                        field.level++
                        return false
                    }
                    return true
                })

                // Remove old step from memory and add next one
                memory = memory.filter((step) => { return step.type !== lowROI.type })
                const newStep = calculateFieldROI(fields[lowROI.type])
                memory.push(newStep)
            }

            // Stop simulation
            // TODO make proper stop, because with oases/res blds it can be weird
            if(lowROI.type === 'iron' && lowROI.level === calculator.simTo-1) running = false
            count++
            // if(count > 300) running = false
            // running = false
        }

        // console.log(memory)
        console.log(fields)
        calculator.build = fields

    }

    const calculateFieldROI = (fields) => {
        let lowField = fields.reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
        // const highField = fields.reduce((curr, prev) => (curr.level <= prev.level) ? prev : curr)

        // Check if lv1 fields exist if lv0 is lowest, because lv2 is better ROI than lv1
        if(lowField.level === 0) {
            if(fields.filter((field) => field.level === 1).length) {
                lowField = fields.filter((field) => field.level === 1)[0]
            }
        }

        return {
            type: lowField.type,
            level: lowField.level + 1 ,
            roi: calculateFieldCost(lowField.type, lowField.level + 1),
            id: lowField.id
        }
    }

    const calculateFieldCost = (fieldType, toLevel) => {
        let buildingType = 'Cropland'
        if(fieldType === 'lumber') buildingType = 'Woodcutter'
        if(fieldType === 'clay') buildingType = 'Clay Pit'
        if(fieldType === 'iron') buildingType = 'Iron Mine'

        const cost = buildingsJson[buildingType][toLevel-1].total_res
        const productionDelta = productionJson[toLevel] - productionJson[toLevel-1]

        // TODO add res building level and oases

        return cost / productionDelta;
    }

    const calculateHMCost = (toLevel, oasisType1, oasisType2) => {
        let fromLevel = 0
        if(toLevel === 15) fromLevel = 10
        if(toLevel === 20) fromLevel = 15

        let cost = 0
        for(let i = fromLevel; i < toLevel; i++) {
            cost += buildingsJson["Hero's Mansion"][i].total_res
        }
        return cost
    }
</script>

<template>
    <CalculatorWrapper title="Ultimate ROI" @close:calculator="close">

        <div class="flex space-x-3 px-2">
            <div class="text-sm">Village type</div>
            <VillageTypeSelector @selection="updateVillageType" />
        </div>

        <div class="flex px-2 mt-4 text-sm items-center space-x-3">
            <div class="w-16">Oases</div>
            <OasisSelector v-for="i in calculator.oases.length"
                           :index="i"
                           :selected="calculator.oases[i-1]"
                           @selection="updateOasis"
            />
        </div>

        <div class="flex px-2 mt-3">
            <RadioSelect legend="Sim to lvl" :options="[10, 20]" :selected="calculator.simTo" @selection="updateSimTo" />
        </div>

        <div class="flex justify-center gap-8 mt-3 text-sm mb-4 pb-2 border-b">
            <div class="flex items-center space-x-3">
                <label>Egyptians
                    <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                           v-model="calculator.egyptian"
                    />
                </label>
            </div>

            <div class="flex items-center space-x-3">
                <label>Gold +25%
                    <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                           v-model="calculator.goldBonus"
                    />
                </label>
            </div>
        </div>

        <div class="mt-4 flex mb-4 justify-center">
            <div class="rounded-lg bg-green-600 text-white py-2 px-6" @click="simROIBuild">Sim</div>
        </div>

        <div class="flex flex-col gap-2">
            <div>{{ calculator.build.lumber }}</div>
            <div>{{ calculator.build.clay }}</div>
            <div>{{ calculator.build.iron }}</div>
            <div>{{ calculator.build.crop }}</div>
        </div>
    </CalculatorWrapper>
</template>
