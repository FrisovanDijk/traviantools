<script setup>
    import ResImg from "@/components/ResImg.vue";
    import ResList from '@/components/ResList.vue'
    import RadioSelect from '@/components/RadioSelect.vue'
    import OasisSelector from '@/components/OasisSelector.vue'
    import VillageTypeSelector from '@/components/VillageTypeSelector.vue'
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"

    import productionJson from '@/data/production.json'

    import { ref, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: Number
    })
    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
    const resultProduction = ref('')

    onBeforeMount(() => {
        calculateConsumption()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
    }

    const updateOasis = (data) => { calculator.oases[data.i-1] = data.type; calculateConsumption()}

    const calculateConsumption = () => {
        let production = 0
        let bonus = 0

        // Calculate base production
        production += calculator.cropFields * productionJson[calculator.fieldLevel]

        // Calculate building bonus
        bonus += 0.5

        // Calculate oasis bonus
        for(let i = 0; i < 3; i++) {
            if(calculator.oases[i].type1 === 'crop') {
                bonus += 0.25
                bonus += 0.0125 * calculator.egyptian
            }
            if(calculator.oases[i].type2 === 'crop') {
                bonus += 0.25
                bonus += 0.0125 * calculator.egyptian
            }
        }

        // Calculate net production
        production += production * bonus

        // Add gold bonus
        if(calculator.goldBonus) production *= 1.25
        production = Math.ceil(production)

        // Production without pop
        production -= calculator.population

        // Delta scout
        const scoutDelta = calculator.scout2 - calculator.scout1
        let consumptionGross = Math.round((3600*scoutDelta/calculator.deltaTime))
        if(calculator.scoutOasis) consumptionGross *= 10

        resultProduction.value = consumptionGross - production
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="troops">

        <div class="flex gap-2 px-4 mt-2 justify-between">
            <div v-for="option in [6, 7, 9, 15]" :key="option">
                <span :for="option"
                      class="w-8 block rounded border text-center py-0.5 px-1 cursor-pointer hover:bg-green-100 border-gray-500"
                      :class="(option === calculator.cropFields ? 'bg-green-200' : 'bg-gray-100')"
                      @click="(e) => {calculator.cropFields = option; calculateConsumption()}"
                >
                    {{ option }}
                </span>
            </div>

            <div class="flex gap-2">
                <span class="flex gap-.5 items-center"><ResImg type="crop" class="w-6"></ResImg> {{$t('level')}}</span>
                <input v-model="calculator.fieldLevel"
                       type="number"
                       min="0"
                       :max="20"
                       class="border border-gray-300 text-sm bg-yellow-200 w-12 pl-2"
                       @change="calculateConsumption"
                >
            </div>
        </div>

        <div class="flex px-4 mt-6 text-sm items-center gap-2">

            <div class="text-right mr-1">{{$t('oases')}}</div>

            <OasisSelector v-for="i in calculator.oases.length"
                           :index="i"
                           :selected="calculator.oases[i-1]"
                           @selection="updateOasis"
            />

        </div>

        <div class="flex px-4 mt-6 gap-2 justify-between">

            <div class="flex gap-1 items-center">
                <div class="mr-2 capitalize">{{$t('population_short')}}</div>
                <input v-model="calculator.population" type="number"
                       class="w-20 border border-gray-600 mr-1 text-sm pl-1 py-0.5"
                       @change="calculateConsumption"
                >
            </div>

            <div class="flex items-center gap-1">
                <div class="mr-2">{{$t('buildings.Waterworks')}}</div>
                <input v-model="calculator.egyptian" type="number"
                       min="0"
                       :max="20"
                       class="w-14 flex-shrink-0 border border-gray-600 mr-1 text-sm pl-2 py-0.5"
                       @change="calculateConsumption"
                >
            </div>

        </div>

        <div class="flex px-4 mt-6 gap-2 justify-between">

            <label>{{$t('gold_bonus')}}
                <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                       v-model="calculator.goldBonus"
                       @change="calculateConsumption"
                />
            </label>

            <label>{{ $t('cropScout.scout_oasis') }}
                <input type="checkbox" class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                       v-model="calculator.scoutOasis"
                       @change="calculateConsumption"
                />
            </label>
        </div>

        <div class="border-b border-slate-800 mt-4 mx-2"></div>

        <div class="flex px-2 mt-3 text-sm items-center space-x-3">
            <div class="w-16 mr-2">{{$t('cropScout.scout1')}}</div>
            <input v-model="calculator.scout1" type="number"
                   class="flex-1 border border-gray-600 mr-1 text-sm pl-1 py-0.5"
                   @change="calculateConsumption"
            >
        </div>

        <div class="flex px-2 mt-3 text-sm items-center space-x-3">
            <div class="w-16 mr-2">{{$t('cropScout.scout2')}}</div>
            <input v-model="calculator.scout2" type="number"
                   class="flex-1 border border-gray-600 mr-1 text-sm pl-1 py-0.5"
                   @change="calculateConsumption"
            >
        </div>

        <div class="flex px-2 mt-3 text-sm items-center space-x-3">
            <div class="flex-1 mr-2">{{$t('cropScout.delta_time')}}</div>
            <input v-model="calculator.deltaTime" type="number"
                   class="border border-gray-600 mr-1 text-sm pl-1 py-0.5"
                   @change="calculateConsumption"
            >
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">{{$t('cropScout.consumption')}}</h2>
        <div class="bg-yellow-200 px-2 py-1 flex">
            {{ resultProduction }} <span class="flex gap-.5 items-center"><ResImg type="crop" class="w-6"></ResImg>{{$t('per_hour')}}</span>
        </div>
    </CalculatorWrapper>
</template>
