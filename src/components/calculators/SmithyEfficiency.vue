<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import TribeSelect from "@/components/TribeSelect.vue"
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
    const updateKey = ref(0)

    onBeforeMount(() => {
        getUpgradeEfficiency()
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
    }

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator
    const upgradeEfficiency = ref([])
    const emit = defineEmits(['repaint'])

    const getUpgradeEfficiency = () => {
        const upgradeStats = []
        for(let i = 0; i < calculator.units.length; i++) {
            const calcUnit = calculator.units[i]
            if(calcUnit) {
                // Get unit stats
                const unit = troops[calculator.tribe][i]

                // Get upgraded unit stats
                // BASE_VALUE + (BASE_VALUE + 300 · UPKEEP / 7) · (1.007^LEVEL – 1)
                const stats = {
                    attack: unit.attack + (unit.attack + 300 * unit.upkeep / 7) * (Math.pow(1.007, calculator.level)-1),
                    def_inf: unit.def_inf + (unit.def_inf + 300 * unit.upkeep / 7) * (Math.pow(1.007, calculator.level)-1),
                    def_cav: unit.def_cav + (unit.def_cav + 300 * unit.upkeep / 7) * (Math.pow(1.007, calculator.level)-1),
                    old_attack: unit.attack + (unit.attack + 300 * unit.upkeep / 7) * (Math.pow(1.007, calculator.level-1)-1),
                    old_def_inf: unit.def_inf + (unit.def_inf + 300 * unit.upkeep / 7) * (Math.pow(1.007, calculator.level-1)-1),
                    old_def_cav: unit.def_cav + (unit.def_cav + 300 * unit.upkeep / 7) * (Math.pow(1.007, calculator.level-1)-1),
                }
                if(stats.attack > stats.def_inf + stats.def_cav || i > 6) {
                    stats.statSum = stats.attack
                    stats.old_statSum = stats.old_attack
                } else {
                    stats.statSum = stats.def_inf + stats.def_cav
                    stats.old_statSum = stats.old_def_inf + stats.old_def_cav
                }


                // Get upgrade cost
                // (base res cost * 7 + coeff) / upkeep * level^0.8
                // coefficient: [lumber 100, clay 100, iron 200, crop 160]
                const upgradeCost = {
                    lumber: Math.round((unit.wood * 7 + 100) / unit.upkeep * Math.pow(calculator.level, 0.8) / 5) * 5,
                    clay: Math.round((unit.clay * 7 + 100) / unit.upkeep * Math.pow(calculator.level, 0.8) / 5) * 5,
                    iron: Math.round((unit.iron * 7 + 200) / unit.upkeep * Math.pow(calculator.level, 0.8) / 5) * 5,
                    crop: Math.round((unit.crop * 7 + 160) / unit.upkeep * Math.pow(calculator.level, 0.8) / 5) * 5
                }

                upgradeCost.total_res = upgradeCost.lumber + upgradeCost.clay + upgradeCost.iron + upgradeCost.crop

                // Add to result
                upgradeStats.push({
                    name: unit.name,
                    upgradeCost: upgradeCost.total_res,
                    unitCost: unit.wood + unit.clay + unit.iron + unit.crop,
                    stats_new: stats.statSum,
                    stats_old: stats.old_statSum
                })
            }
        }

        // Get smithy cost
        let costSmithy = 0
        if(calculator.smithy) {
            const smithy = buildings['Smithy'][calculator.level-1]
            costSmithy += smithy.total_res
        }

        const result = []
        // Calculate break-even
        upgradeStats.forEach((unit) => {
            unit.upgradeCost += costSmithy / upgradeStats.length
            // (UPGRADE_COST / (NEW_STAT - OLD_STAT)) / (TROOP_COST / OLD_STAT)
            unit.breakeven = (unit.upgradeCost / (unit.stats_new - unit.stats_old)) / (unit.unitCost / unit.stats_old)
            result.push({
                name: unit.name,
                breakeven: Math.round(unit.breakeven)
            })
        })

        upgradeEfficiency.value = result

        setTimeout(() => { emit('repaint') }, 100)
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
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close" type="troops">
        <div class="flex flex-col" @change="getUpgradeEfficiency">
            <TribeSelect :selected="calculator.tribe" @selection="(tribe) => {calculator.tribe = tribe; getUpgradeEfficiency()}" class="mt-2" />

            <div class="flex mt-6 px-6 gap-4 flex-wrap">
                <label class="flex-0">
                    <label>
                        <input type="checkbox" v-model="calculator.smithy" class="mr-1">
                        {{$t('troopsTraining.cost_smithy')}}
                    </label>
                </label>
                <label class="flex-0">
                    {{$t('troopsTraining.level_upgrade')}}
                    <select v-model="calculator.level" class="border border-gray-500 px-1 ml-1">
                        <option v-for="(bonus, index) in 20" v-bind:key="bonus">{{ bonus }}</option>
                    </select>
                </label>
            </div>

            <div class="flex flex-wrap px-4 mt-4 mb-1">
                <label v-for="(unit, index) in getUnits()" v-bind:key="calculator.level" class="w-1/2 py-1.5">
                    <input type="checkbox" :id="index" :value="unit.name" v-model="calculator.units[index]">
                    {{ $t(getUnitShort(unit.name)) }}
                </label>
            </div>

            <h2 class="mt-2 py-1 mx-2 font-bold">{{$t('troopsTraining.break_even_level', { level: calculator.level })}}</h2>
            <div class="bg-yellow-200 p-2 flex flex-wrap" :key="updateKey">
                <div class="w-1/2" v-for="unit in upgradeEfficiency" v-if="upgradeEfficiency.length">{{unit.breakeven}} {{ $t(getUnitShort(unit.name)) }}</div>
                <div class="" v-else>{{$t('troopsTraining.no_selection')}}</div>
            </div>
        </div>

    </CalculatorWrapper>
</template>
