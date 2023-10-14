<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import ResImg from '@/components/ResImg.vue'
    import VillageTypeSelector from '@/components/VillageTypeSelector.vue'
    import OasisSelector from '@/components/OasisSelector.vue'
    import RadioSelect from "@/components/RadioSelect.vue"

    import buildingsJson from '@/data/buildings.json'
    import productionJson from '@/data/production.json'

    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    // Variables

    onBeforeMount(() => {
        // calculateROI() No sim before mount here I guess
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators[props.index] = {}
    }

    const updateOasis = (data) => { calculator.oases[data.i-1] = data.type}
    const updateVillageType = (data) => { calculator.villagetype = data.type}
    const updateSimTo = (data) => { calculator.simTo = data}

    // Primary function, starts a loop to sim the village
    // There's over 60.000 possible combinations of villages, oases, gold use and tribe that can be simulated
    const simROIBuild = () => {
        // Set up variables
        calculator.tab = 0
        const fields = { // Fields of the village
            crop: [],
            clay: [],
            lumber: [],
            iron: [],
            buildings: {
                crop: 0,
                clay: 0,
                lumber: 0,
                iron: 0,
                egyptian: 0,
                hm: 0
            }
        }
        /**
         *  Steps based on type:
         *  crop, clay, lumber, iron: { type, level, roi, fieldID}
         *  building: { type, fieldType, level, roi, fieldID, sim10}
         */
        let memory = [] // Remember previously calculated steps to increase performance
        const build = [] // Simulated build queue

        // Create fields and first run of ROI steps on fields
        const restypes = ['crop', 'clay', 'lumber', 'iron']
        restypes.forEach((type) => {
            for(let i = 0; i < calculator.villagetype[type]; i++) {
                fields[type].push({
                    id: i,
                    type: type,
                    level: 0
                })
            }
            memory.push(calculateFieldROI(fields, type))
            memory.push(calculateBuildingROI(fields, type))
        })

        // Start simulation
        let running = true
        let count = 0
        while(running) {

            // Select lowest ROI
            const lowROI = memory.reduce((curr, prev) => (curr.roi <= prev.roi && curr.level < 20) ? curr : prev)

            const getBuildMessage = buildMessage(lowROI)
            build.push(getBuildMessage)

            // If type is field, then up the level
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

                let lowField = fields[lowROI.type].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
                if(lowField.level < calculator.simTo) {
                    const newStep = calculateFieldROI(fields, lowROI.type)
                    memory.push(newStep)
                }

                // Calculate relevant res building
                if(fields.buildings[lowROI.type] < 5 || (lowROI.type === 'crop' && fields.buildings[lowROI.type] < 10)) {
                    memory = memory.filter((step) => { return step.fieldType !== lowROI.type })
                    const newBuildingStep = calculateBuildingROI(fields, lowROI.type)
                    memory.push(newBuildingStep)
                }
            }

            // If type is res building, update building level and recalculate relevant res ROI + res buildings
            // TODO
            if(lowROI.type === 'building') {
                if(!lowROI.sim10) {
                    fields.buildings[lowROI.fieldType]++
                } else {
                    fields[lowROI.fieldType].every((field) => {
                        if(field.id === lowROI.id) {
                            field.level = 10
                            return false
                        }
                        return true
                    })

                    fields.buildings[lowROI.fieldType] = lowROI.level
                }

                memory = memory.filter((step) => { return step.fieldType !== lowROI.fieldType })
                if(lowROI.level < 5 || (lowROI.type === 'crop' && fields.buildings[lowROI.type] < 10)) {
                    const newBuildingStep = calculateBuildingROI(fields, lowROI.fieldType)
                    memory.push(newBuildingStep)
                }

                // Calculate relevant res ROI
                memory = memory.filter((step) => { return step.type !== lowROI.fieldType })
                let lowField = fields[lowROI.fieldType].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
                if(lowField.level < calculator.simTo) {
                    const newStep = calculateFieldROI(fields, lowROI.fieldType)
                    memory.push(newStep)
                }
            }

            // If type is oasis, update level + active oasis and recalculate relevant res


            // If type is waterworks, update building level and recalculate relevant res


            // With every change recalculate ROI for HM + WW, res buildings


            // Stop simulation
            // TODO make proper stop, because with oases/res blds it can break
            // if(lowROI.type === 'iron' && lowROI.level === calculator.simTo) running = false
            count++
            // if(count > 300) running = false
            // running = false

            if(memory.length === 0) running = false
        }

        console.log(build)
        calculator.build = build

    }

    const calculateFieldROI = (fields, fieldType) => {
        let lowField = fields[fieldType].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
        // const highField = fields.reduce((curr, prev) => (curr.level <= prev.level) ? prev : curr)

        // Check if level one fields exist if level zero is lowest, because level two is better ROI than level one
        if(lowField.level === 0) {
            if(fields[fieldType].filter((field) => field.level === 1).length) {
                lowField = fields[fieldType].filter((field) => field.level === 1)[0]
            }
        }

        let fieldCost = calculateFieldCost(lowField.type, lowField.level + 1, fields.buildings[fieldType])

        return {
            type: lowField.type,
            level: lowField.level + 1 ,
            roi: fieldCost.cost / fieldCost.productionDelta,
            id: lowField.id
        }
    }

    const calculateFieldCost = (fieldType, toLevel, buildingLevel) => {
        let buildingType = 'Cropland'
        if(fieldType === 'lumber') buildingType = 'Woodcutter'
        if(fieldType === 'clay') buildingType = 'Clay Pit'
        if(fieldType === 'iron') buildingType = 'Iron Mine'

        const cost = buildingsJson[buildingType][toLevel-1].total_res
        let productionDelta = productionJson[toLevel] - productionJson[toLevel-1]
        productionDelta += productionDelta * 0.05 * buildingLevel

        // TODO add oases to productionDelta

        return {
            cost: cost,
            productionDelta: productionDelta
        }
    }

    const calculateBuildingROI = (fields, fieldType) => {
        const highField = fields[fieldType].reduce((curr, prev) => (curr.level <= prev.level) ? prev : curr)

        let buildingType = 'Grain Mill'
        if(highField.type === 'lumber') buildingType = 'Sawmill'
        if(highField.type === 'clay') buildingType = 'Brickyard'
        if(highField.type === 'iron') buildingType = 'Iron Foundry'
        let currLevel = fields.buildings[highField.type]
        if(highField.type === 'crop' && currLevel >= 5) {
            buildingType = 'Bakery'
            currLevel = currLevel - 5
        }

        let prodGross = 0
        let sim10 = true;

        // Sum of gross production
        fields[highField.type].forEach((field) => {
            prodGross += productionJson[field.level]
            if(field.level >= 10) sim10 = false
        })

        // Get results from upping a building level
        let cost = buildingsJson[buildingType][currLevel].total_res
        let productionDelta = 0.05 * prodGross

        // Get building cost for all levels up to that level when simulating a lv10 field
        if(sim10) {
            const sim10Outcome = simTo10(highField, fields.buildings[highField.type], prodGross)

            if(buildingType === 'Grain Mill' && sim10Outcome.cost / sim10Outcome.productionDelta > cost / productionDelta ) {
                return {
                    type: 'building',
                    fieldType: highField.type,
                    level: fields.buildings[highField.type] + 1,
                    roi: cost / productionDelta,
                    sim10: false
                }
            } else {
                return {
                    type: 'building',
                    fieldType: highField.type,
                    level: sim10Outcome.buildingLevel,
                    roi: sim10Outcome.cost / sim10Outcome.productionDelta,
                    id: highField.id,
                    sim10: true
                }
            }
        } else {
            return {
                type: 'building',
                fieldType: highField.type,
                level: fields.buildings[highField.type] + 1,
                roi: cost / productionDelta,
                sim10: false
            }
        }
    }

    const simTo10 = (highField, buildingLevel, totalProduction, cost = 0, productionDelta = 0, count = 0) => {
        let oldCost = cost
        let oldProductionDelta = productionDelta

        // Determine field cost and production delta at first run
        if(highField.level < 10 && cost === 0 && productionDelta === 0) {
            for(let i = highField.level + 1; i <= 10; i++) {
                let fieldCost = calculateFieldCost(highField.type, i, buildingLevel);
                cost += fieldCost.cost
                productionDelta += fieldCost.productionDelta
            }
            totalProduction += productionDelta
        }

        // determine building cost and production delta
        let buildingType = 'Grain Mill'
        let tempLevel = buildingLevel
        if(highField.type === 'lumber') buildingType = 'Sawmill'
        if(highField.type === 'clay') buildingType = 'Brickyard'
        if(highField.type === 'iron') buildingType = 'Iron Foundry'
        if(highField.type === 'crop' && buildingLevel >= 5) {
            buildingType = 'Bakery'
            tempLevel = buildingLevel - 5
        }
        cost += buildingsJson[buildingType][tempLevel].total_res
        productionDelta += totalProduction * 0.05

        // If old ROI is better than new ROI, return
        if(oldCost / oldProductionDelta < cost / productionDelta && productionDelta > 0) {
            return {
                buildingLevel: ( buildingLevel ),
                cost: oldCost,
                productionDelta: oldProductionDelta
            }
        }
        // Otherwise try again
        buildingLevel++
        return simTo10({ level: 10, type: highField.type}, buildingLevel, totalProduction, cost, productionDelta, count)
    }

    const buildMessage = (step) => {
        let message = ''
        if(step.type === 'building') {
            let buildingType = 'Grain Mill'
            if(step.fieldType === 'lumber') buildingType = 'Sawmill'
            if(step.fieldType === 'clay') buildingType = 'Brickyard'
            if(step.fieldType === 'iron') buildingType = 'Iron Foundry'
            let currLevel = step.level
            if(step.fieldType === 'crop' && currLevel > 5) {
                buildingType = 'Bakery'
                currLevel = currLevel - 5
            }

            let resBuildingType = 'Cropland'
            if(step.fieldType === 'lumber') resBuildingType = 'Woodcutter'
            if(step.fieldType === 'clay') resBuildingType = 'Clay Pit'
            if(step.fieldType === 'iron') resBuildingType = 'Iron Mine'

            if(step.sim10) {
                message = `${resBuildingType} to 10 and ${buildingType} to ${currLevel}`
            } else {
                message = `${buildingType} to ${currLevel}`
            }
        }

        if(step.type === 'crop' || step.type === 'lumber' || step.type === 'clay' || step.type === 'iron') {
            let resBuildingType = 'Cropland'
            if(step.type === 'lumber') resBuildingType = 'Woodcutter'
            if(step.type === 'clay') resBuildingType = 'Clay Pit'
            if(step.type === 'iron') resBuildingType = 'Iron Mine'

            message = `${resBuildingType} to ${step.level}`
        }

        const roiDays = step.roi/24
        const days = Math.floor(roiDays)
        const hoursfraction = (roiDays - days) * 24
        const hours = Math.floor(hoursfraction)
        const minutesfraction = (hoursfraction - hours) * 60
        const minutes = Math.round(minutesfraction)

        const roiString = `${days}d ${hours}h ${minutes}m`

        return {
            text: message,
            roi: roiString,
            completed: false
        }

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
            <VillageTypeSelector @selection="updateVillageType" :selected="calculator.villagetype" />
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

        <div class="flex px-2 gap-4 mt-3 text-sm pb-4 border-b">
            <div class="flex flex-col gap-4">
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

            <div class="mt-4 flex mb-2 justify-end flex-1">
                <div class="rounded-lg bg-green-600 mr-8 text-white py-2 px-6 cursor-pointer" @click="simROIBuild">Sim</div>
            </div>

        </div>

        <div class="flex flex-col gap-2">
            <div class="flex flex-col">
                <div class="p-2" v-if="calculator.build.length === 0">Select a build to simulate</div>
                <div v-else
                     v-for="i in 10"
                     :class="[
                         'border-b py-1 px-2 flex justify-between hover:bg-green-300 cursor-pointer',
                         (calculator.build[calculator.tab * 10 + i - 1].completed ? 'bg-green-200' : 'bg-yellow-200')
                     ]"
                     @click="calculator.build[calculator.tab * 10 + i - 1].completed = !calculator.build[calculator.tab * 10 + i - 1].completed"
                >
                    <!-- TODO fix bug with trying to display nonexistent -->
                    <div>{{ calculator.build[calculator.tab * 10 + i - 1].text }}</div>
                    <div class="text-xs">{{ calculator.build[calculator.tab * 10 + i - 1].roi }}</div>
                </div>
            </div>
            <div class="flex justify-center gap-8 mt-2 mb-3">
                <div class="bg-green-600 rounded px-4 py-1 text-white cursor-pointer" @click="calculator.tab--"
                     v-if="calculator.tab > 0"
                >
                    prev</div>
                <!-- TODO check if made invisible on last tab when that works -->
                <div class="bg-green-600 rounded px-4 py-1 text-white cursor-pointer" @click="calculator.tab++"
                     v-if="calculator.build.length / calculator.tab > 10"
                >
                    next</div>
            </div>
        </div>
    </CalculatorWrapper>
</template>
