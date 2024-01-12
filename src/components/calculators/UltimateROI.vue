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

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
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
         *  crop, clay, lumber, iron: { type, level, roi, fieldID }
         *  building: { type, fieldType, level, roi, fieldID, sim10 }
         *  oasis: { type, level, roi }
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
                    level: 1
                })
            }
            memory.push(calculateFieldROI(fields, type))
            memory.push(calculateBuildingROI(fields, type))
        })
        // Setup HM ROI
        let oasiscount = 0
        for(let i = 0; i < 3; i++) {
            if(calculator.oases[i].type1) oasiscount++
        }
        if(oasiscount > 0) {
            memory.push(calculateOasisROI(fields))
            // Set up WW ROI
            if(calculator.egyptian) memory.push(calculateWWROI(fields))
        }

        // Start simulation
        let running = true
        while(running) {

            // Select lowest ROI
            const lowROI = memory.reduce((curr, prev) =>
                (curr.roi >= prev.roi) ? prev : curr
            )

            // Set UI text for lowROI step
            const getBuildMessage = buildMessage(lowROI, build[build.length-1])
            if(getBuildMessage) build.push(getBuildMessage)

            // If type is field, then up the level and recalculate relevant ROI for res, res buildings, HM and WW
            if(lowROI.type === 'crop' || lowROI.type === 'lumber' || lowROI.type === 'clay' || lowROI.type === 'iron' ) {
                fields[lowROI.type].every((field) => {
                    if(field.id === lowROI.id) {
                        field.level++
                        return false
                    }
                    return true
                })

                // Remove old step from memory and add next one from field type
                memory = memory.filter((step) => { return step.type !== lowROI.type })

                let lowField = fields[lowROI.type].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
                if(lowField.level < calculator.simTo || (lowField.type === 'crop' && calculator.simTo === 20 && lowField.level === 20)) {
                    const newStep = calculateFieldROI(fields, lowROI.type)
                    memory.push(newStep)
                }

                // Calculate relevant res building for field type
                if(fields.buildings[lowROI.type] < 5 || (lowROI.type === 'crop' && fields.buildings[lowROI.type] < 10)) {
                    memory = memory.filter((step) => { return step.fieldType !== lowROI.type })
                    const newBuildingStep = calculateBuildingROI(fields, lowROI.type)
                    memory.push(newBuildingStep)
                }

                // Calculate relevant HM ROI for next oasis
                if(5 + oasiscount * 5 > fields.buildings.hm) {
                    let tier = 0
                    if(fields.buildings.hm / 5 > 0) {
                        tier = fields.buildings.hm / 5 - 1
                    }
                    if(calculator.oases[tier].type1 === lowROI.type || calculator.oases[tier].type2 === lowROI.type) {
                        memory = memory.filter((step) => { return step.type !== 'oasis' })
                        const newBuildingStep = calculateOasisROI(fields)
                        memory.push(newBuildingStep)
                    }
                }

                // Recalculate WW ROI
                if(calculator.egyptian && fields.buildings.hm > 0 && fields.buildings.egyptian < 20) {
                    memory = memory.filter((step) => { return step.type !== 'egyptian' })
                    const newBuildingStep = calculateWWROI(fields)
                    memory.push(newBuildingStep)
                }
            }

            // If type is res building, update building level and recalculate relevant ROI for res, res buildings
            if(lowROI.type === 'building') {
                // Update building level
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

                // Select next building step ROI
                memory = memory.filter((step) => { return step.fieldType !== lowROI.fieldType })
                if(lowROI.level < 5 || (lowROI.fieldType === 'crop' && fields.buildings[lowROI.fieldType] < 10)) {
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

            // If type is oasis, update level and recalculate relevant ROI for res, HM, WW
            if(lowROI.type === 'oasis') {
                // Up HM level
                fields.buildings.hm = lowROI.level

                // Remove step from memory
                memory = memory.filter((step) => { return step.type !== 'oasis' })

                // If there's a next oasis, add the next step
                if(5 + oasiscount * 5 > fields.buildings.hm) {
                    // Get new building step for next oasis
                    const newBuildingStep = calculateOasisROI(fields)
                    memory.push(newBuildingStep)
                }

                // Recalculate field ROI based on oasis field types
                let nextType1 = calculator.oases[fields.buildings.hm / 5 - 2].type1
                let nextType2 = calculator.oases[fields.buildings.hm / 5 - 2].type2
                if(nextType1) {
                    memory = memory.filter((step) => { return step.type !== nextType1 })
                    let lowField = fields[nextType1].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
                    if(lowField.level < calculator.simTo) {
                        const newStep = calculateFieldROI(fields, nextType1)
                        memory.push(newStep)
                    }

                    if(nextType2) {
                        memory = memory.filter((step) => { return step.type !== nextType2 })
                        let lowField = fields[nextType2].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
                        if(lowField.level < calculator.simTo) {
                            const newStep = calculateFieldROI(fields, nextType2)
                            memory.push(newStep)
                        }
                    }
                }

                // Recalculate WW ROI
                if(calculator.egyptian) {
                    memory = memory.filter((step) => { return step.type !== 'egyptian' })
                    const newBuildingStep = calculateWWROI(fields)
                    memory.push(newBuildingStep)
                }
            }

            // If type is egyptian, update WW level and recalculate relevant ROI for res, WW
            if(lowROI.type === 'egyptian') {
                // Up WW level
                fields.buildings.egyptian = lowROI.level

                // Remove step from memory
                memory = memory.filter((step) => { return step.type !== 'egyptian' })

                // Add next step
                if(fields.buildings.egyptian < 20) {
                    const newBuildingStep = calculateWWROI(fields)
                    memory.push(newBuildingStep)
                }

                // For active oases recalculate res field
                const oases = {
                    'lumber': false,
                    'clay': false,
                    'iron': false,
                    'crop': false
                }
                if(fields.buildings.hm > 0) {
                    const tier = fields.buildings.hm / 5 - 1
                    for(let i = 0; i < tier; i++) {
                        oases[calculator.oases[i].type1] = true
                        oases[calculator.oases[i].type2] = true
                    }
                }
                restypes.forEach((type) => {
                    if(oases[type]) {
                        memory = memory.filter((step) => { return step.type !== type })
                        let lowField = fields[type].reduce((curr, prev) => (curr.level >= prev.level) ? prev : curr)
                        if(lowField.level < calculator.simTo) {
                            const newStep = calculateFieldROI(fields, type)
                            memory.push(newStep)
                        }
                    }
                })

            }

            // Stop simulation
            if(memory.length === 0) running = false
        }

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

        let fieldCost = calculateFieldCost(lowField.type, lowField.level + 1,
            fields.buildings[fieldType], fields.buildings.hm, fields.buildings.egyptian)

        return {
            type: lowField.type,
            level: lowField.level + 1 ,
            roi: fieldCost.cost / (fieldCost.productionDelta * (calculator.goldBonus ? 1.25 : 1)),
            id: lowField.id
        }
    }

    const calculateFieldCost = (fieldType, toLevel, buildingLevel, hmLevel, wwLevel) => {
        let buildingType = 'Cropland'
        if(fieldType === 'lumber') buildingType = 'Woodcutter'
        if(fieldType === 'clay') buildingType = 'Clay Pit'
        if(fieldType === 'iron') buildingType = 'Iron Mine'

        const cost = buildingsJson[buildingType][toLevel-1].total_res
        let productionDelta = productionJson[toLevel] - productionJson[toLevel-1]
        let netDelta = productionDelta + productionDelta * 0.05 * buildingLevel

        if(hmLevel > 0) {
            const tier = hmLevel / 5 - 1
            for(let i = 0; i < tier; i++) {
                if(calculator.oases[i].type1 === fieldType) {
                    netDelta += 0.25 * productionDelta
                    netDelta += 0.0125 * wwLevel * productionDelta
                }
                if(calculator.oases[i].type2 === fieldType) {
                    netDelta += 0.25 * productionDelta
                    netDelta += 0.0125 * wwLevel * productionDelta
                }
            }
        }

        return {
            cost: cost,
            productionDelta: netDelta
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

        // So you don't have to 'sim' first crop to 5 on 15c
        if(highField.level < 5) { cost = 9999999; productionDelta = 1; sim10 = false}

        // Get building cost for all levels up to that level when simulating a lv10 field
        if(sim10) {
            const sim10Outcome = simTo10(highField, fields.buildings[highField.type], prodGross, fields.buildings.hm, fields.buildings.egyptian)

            if(buildingType === 'Grain Mill' && sim10Outcome.cost / sim10Outcome.productionDelta > cost / productionDelta ) {
                return {
                    type: 'building',
                    fieldType: highField.type,
                    level: fields.buildings[highField.type] + 1,
                    roi: cost / (productionDelta * (calculator.goldBonus ? 1.25 : 1)),
                    sim10: false
                }
            } else {
                return {
                    type: 'building',
                    fieldType: highField.type,
                    level: sim10Outcome.buildingLevel,
                    roi: sim10Outcome.cost / (sim10Outcome.productionDelta * (calculator.goldBonus ? 1.25 : 1)),
                    id: highField.id,
                    sim10: true
                }
            }
        } else {
            return {
                type: 'building',
                fieldType: highField.type,
                level: fields.buildings[highField.type] + 1,
                roi: cost / (productionDelta * (calculator.goldBonus ? 1.25 : 1)),
                sim10: false
            }
        }
    }

    const simTo10 = (highField, buildingLevel, totalProduction, hmLevel = 0, wwLevel = 0, cost = 0, productionDelta = 0, count = 0) => {
        let oldCost = cost
        let oldProductionDelta = productionDelta

        let logs = false
        if(highField.type === 'crop') logs = true

        // Determine field cost and production delta at first run
        if(highField.level < 10 && cost === 0 && productionDelta === 0) {
            for(let i = highField.level + 1; i <= 10; i++) {
                let fieldCost = calculateFieldCost(highField.type, i, buildingLevel, hmLevel, wwLevel);
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

        // Avoid bug that temp level can go too high
        if(tempLevel === 5) {
            cost = 999999999; productionDelta = 1
        } else {
            cost += buildingsJson[buildingType][tempLevel].total_res
            productionDelta += totalProduction * 0.05
        }

        // If old ROI is better than new ROI, return
        if(oldCost / oldProductionDelta < cost / productionDelta && productionDelta > 0 && oldProductionDelta > 0) {
            return {
                buildingLevel: buildingLevel,
                cost: oldCost,
                productionDelta: oldProductionDelta
            }
        }
        // Otherwise try again
        buildingLevel++
        return simTo10({ level: 10, type: highField.type}, buildingLevel, totalProduction, hmLevel, wwLevel, cost, productionDelta, count)
    }

    const calculateOasisROI = (fields) => {
        let fromLevel = fields.buildings.hm
        let toLevel = 10
        let tier = 0
        if(fromLevel === 10) {
            toLevel = 15
            tier = 1
        }
        if(fromLevel === 15) {
            toLevel = 20
            tier = 2
        }

        let cost = 0

        for(let i = fromLevel; i < toLevel; i++) {
            cost += buildingsJson["Hero's Mansion"][i].total_res
        }

        let prodGrossType1 = 0
        let prodGrossType2 = 0
        if(calculator.oases[tier].type1) {
            fields[calculator.oases[tier].type1].forEach((row) => {
                prodGrossType1 += productionJson[row.level]
            })
        }
        if(calculator.oases[tier].type2) {
            fields[calculator.oases[tier].type2].forEach((row) => {
                prodGrossType2 += productionJson[row.level]
            })
        }

        let productionDelta = 0
        if(calculator.oases[tier].type1 !== calculator.oases[tier].type2) {
            productionDelta += 0.25 * prodGrossType1 + 0.25 * prodGrossType2
            if(calculator.egyptian) productionDelta += 0.0125 * (prodGrossType1 + prodGrossType2)
        } else {
            productionDelta += 0.5 * prodGrossType1
            if(calculator.egyptian) productionDelta += 0.025 * prodGrossType1
        }

        // Gold
        productionDelta *= (calculator.goldBonus ? 1.25 : 1)

        return {
            type: 'oasis',
            level: toLevel ,
            roi: cost / productionDelta
        }

    }

    const calculateWWROI = (fields) => {
        // Setup
        const toLevel = fields.buildings.egyptian
        const oases = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }
        const resTypes = ['lumber', 'clay', 'iron', 'crop']

        // Get cost
        let cost = buildingsJson["Waterworks"][toLevel].total_res

        // Get all oasis types of active oases and net prod
        if(fields.buildings.hm > 0) {
            const tier = fields.buildings.hm / 5 - 1
            for(let i = 0; i < tier; i++) {
                oases[calculator.oases[i].type1]++
                oases[calculator.oases[i].type2]++
            }

            // Calculate productionDelta with 5% increase in oasis bonus
            let productionDelta = 0
            resTypes.forEach((type) => {
                fields[type].forEach((row) => {
                    productionDelta += productionJson[row.level] * 0.0125 * oases[type]
                })
            })

            // Gold
            productionDelta *= (calculator.goldBonus ? 1.25 : 1)

            // Return results
            return {
                type: 'egyptian',
                level: toLevel + 1 ,
                roi: cost / productionDelta
            }
        }

        // Return bogus results
        return {
            type: 'egyptian',
            level: 1 ,
            roi: 99999
        }
    }

    const buildMessage = (step, lastMessage = {}) => {
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

        if(step.type === 'oasis') {
            message = `Hero's Mansion to ${step.level} and capture oasis`
        }

        if(step.type === 'egyptian') {
            message = `Waterworks to ${step.level}`
        }

        if(step.type === 'crop' || step.type === 'lumber' || step.type === 'clay' || step.type === 'iron') {
            let resBuildingType = 'Cropland'
            if(step.type === 'lumber') resBuildingType = 'Woodcutter'
            if(step.type === 'clay') resBuildingType = 'Clay Pit'
            if(step.type === 'iron') resBuildingType = 'Iron Mine'

            message = `${resBuildingType} to ${step.level}`
            if(lastMessage.text === message) {
                lastMessage.count++
                return false
            }
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
            completed: false,
            count: 1
        }

    }

    const getBuildTab = () => {
        let tabSize = 8
        let tab = []

        for(let i = 0; i < tabSize; i++) {
            if(calculator.build[calculator.tab * tabSize + i]) {
                tab.push(calculator.build[calculator.tab * tabSize + i])
            }
        }

        return tab
    }

</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="economy">

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
                     v-for="(row, i) in getBuildTab()"
                     :class="[
                         'border-b py-1 px-2 flex justify-between hover:bg-green-300 cursor-pointer',
                         (row.completed ? 'bg-green-200' : 'bg-yellow-200')
                     ]"
                     @click="row.completed = !row.completed"
                >
                    <div>
                        <template v-if="row.count > 1">{{ row.count }} x </template>
                        {{ row.text }}
                    </div>
                    <div class="text-xs w-24 text-right">{{ row.roi }}</div>
                </div>
            </div>
            <div class="flex justify-center gap-8 mt-2 mb-3">
                <div class="bg-green-600 rounded px-4 py-1 text-white cursor-pointer" @click="calculator.tab--"
                     v-if="calculator.tab > 0"
                >
                    prev</div>
                <div class="bg-green-600 rounded px-4 py-1 text-white cursor-pointer" @click="calculator.tab++"
                     v-if="calculator.build.length > (calculator.tab + 1) * 8"
                >
                    next</div>
            </div>
        </div>
    </CalculatorWrapper>
</template>
