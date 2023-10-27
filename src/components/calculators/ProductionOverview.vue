<script setup>
    import ResImg from "@/components/ResImg.vue";
    import ResList from '@/components/ResList.vue'
    import OasisSelector from '@/components/OasisSelector.vue'
    import VillageTypeSelector from '@/components/VillageTypeSelector.vue'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"

    import buildingsJson from '@/data/buildings.json'
    import productionJson from '@/data/production.json'

    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
    const resultProduction = ref('')

    onBeforeMount(() => {
        calculateProduction()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index)
    }

    const updateOasis = (data) => { calculator.oases[data.i-1] = data.type; calculateProduction()}
    const updateVillageType = (data) => { calculator.villagetype = data.type; calculateProduction()}

    // TODO building type

    const calculateProduction = () => {
        const production = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }
        const restypes = ['crop', 'clay', 'lumber', 'iron']
        const bonus = {
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }

        // For each res type
        restypes.forEach((type) => {
            // Calculate base production
            production[type] += calculator.villagetype[type] * productionJson[calculator.level[type]]

            // Calculate building bonus
            bonus[type] += 0.05 * calculator.building[type]

            // Calculate oasis bonus
            for(let i = 0; i < 3; i++) {
                if(calculator.oases[i].type1 === type) {
                    bonus[type] += 0.25
                    bonus[type] += 0.0125 * calculator.building.egyptian
                }
                if(calculator.oases[i].type2 === type) {
                    bonus[type] += 0.25
                    bonus[type] += 0.0125 * calculator.building.egyptian
                }
            }

            // Calculate net production
            production[type] += production[type] * bonus[type]

            // Add gold bonus
            if(calculator.goldBonus) production[type] *= 1.25
        })


        // Return result
        resultProduction.value = production
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close">

        <div class="flex space-x-2 pr-2">
            <div class="w-20 text-sm text-right">Village type</div>
            <VillageTypeSelector @selection="updateVillageType" :selected="calculator.villagetype" />
        </div>

        <div class="flex pr-2 mt-3 text-sm items-center space-x-2">
            <div class="w-20 text-right">Oases</div>
            <OasisSelector v-for="i in calculator.oases.length"
                           :index="i"
                           :selected="calculator.oases[i-1]"
                           @selection="updateOasis"
            />
        </div>

        <div class="flex justify-between px-6 mt-2">
            <span class="w-11">&nbsp;</span>
            <ResImg type="lumber"></ResImg>
            <ResImg type="clay"></ResImg>
            <ResImg type="iron"></ResImg>
            <ResImg type="crop"></ResImg>
        </div>
        <div class="flex justify-between px-2 pb-1"
             v-for="(row, index) in ['level', 'building']"
             :key="index"
             @change="calculateProduction"
        >
            <div type="text" class="w-16 text-sm mr-2 text-right">{{row}}</div>
            <input v-model="calculator[row].lumber" type="number" min="0" :max="(row === 'level' ? 20 : 5)" style="width: 2.8rem; padding-left: 0.2rem; background-color: rgb(255,222,173)" class="border border-gray-300 text-sm">
            <input v-model="calculator[row].clay" type="number" min="0" :max="(row === 'level' ? 20 : 5)" style="width: 2.8rem; padding-left: 0.2rem" class="border border-gray-300 text-sm bg-red-200">
            <input v-model="calculator[row].iron" type="number" min="0" :max="(row === 'level' ? 20 : 5)" style="width: 2.8rem; padding-left: 0.2rem" class="border border-gray-300 text-sm bg-gray-200">
            <input v-model="calculator[row].crop" type="number" min="0" :max="(row === 'level' ? 20 : 10)" style="width: 2.8rem; padding-left: 0.2rem" class="border border-gray-300 text-sm bg-yellow-200">
        </div>

        <div class="flex px-2 mt-3 text-sm items-center space-x-3">
            <div class="w-16 mr-2">Waterworks</div>
            <input v-model="calculator.building.egyptian" type="number"
                   min="0"
                   :max="20"
                   style="width: 3.3rem; padding: 0 0.1rem"
                   class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                   @change="calculateProduction"
            >
        </div>

        <div class="flex px-2 mt-3 text-sm items-center space-x-3">
            <label>Gold +25%
                <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                       v-model="calculator.goldBonus"
                       @change="calculateProduction"
                />
            </label>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Hourly production</h2>
        <div class="bg-yellow-200">
            <ResList :resources="resultProduction" :total="true" class=""></ResList>
        </div>
    </CalculatorWrapper>
</template>
