<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import TribeSelect from "@/components/TribeSelect.vue"
    import troopsJson from '@/data/troops.json'
    import { userData } from '@/stores/userData.js'
    import ResImg from '@/components/ResImg.vue'

    const props = defineProps({
        index: Number
    })
    const troops = troopsJson

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index)
    }

    const calculator = userData.tabs[userData.currentTab].calculators[props.index].calculator

    const getInf = () => { return troops[calculator.tribe].filter((e) => {return e.type === 'inf'}) }
    const getCav = () => { return troops[calculator.tribe].filter((e) => {return e.type === 'cav'}) }
    const getSiege = () => { return troops[calculator.tribe].filter((e) => {return e.type === 'siege'}) }

    const getTroops = () => {
        const mod_trainer = 1 - (calculator.artifact / 100)
        const mod_bonus = 1 - (calculator.recruitment / 100)
        const interval = 3600 * calculator.training_amount * getInterval(calculator.time_type);

        const inf = troops[calculator.tribe].filter((e) => {return e.name === calculator.barracks.unit})[0]
        const cav = troops[calculator.tribe].filter((e) => {return e.name === calculator.stables.unit})[0]
        const siege = troops[calculator.tribe].filter((e) => {return e.name === calculator.workshop.unit})[0]

        if(!inf && calculator.barracks.amount > 0) return false
        if(!cav && calculator.stables.amount > 0) return false
        if(!siege && calculator.workshop.amount > 0) return false

        let consumption = 0
        let cost = {
            wood: 0,
            clay: 0,
            iron: 0,
            crop: 0,
            total: 0
        }

        let inf_troops = 0
        if(calculator.barracks.amount > 0) {
            const inf_time = inf.training_time.split(':')
            const inf_time_sec = Number(inf_time[0]) * 3600 + Number(inf_time[1]) * 60 + Number(inf_time[2])
            const mod_barracks = Math.pow(0.9,calculator.barracks.level - 1)
            const inf_helmet = 1 + calculator.barracks.helmet / 100
            const inf_time_mods = (inf_time_sec * mod_barracks * mod_trainer * mod_bonus) / inf_helmet

            inf_troops = Math.round(interval / inf_time_mods * calculator.barracks.amount)
            cost.wood += inf.wood * inf_troops
            cost.clay += inf.clay * inf_troops
            cost.iron += inf.iron * inf_troops
            cost.crop += inf.crop * inf_troops
            cost.total += inf.total_res * inf_troops
            consumption += inf_troops * inf.upkeep

            if(calculator.barracks.great_level > 0) {
                const mod_great_barracks = Math.pow(0.9,calculator.barracks.great_level - 1)
                const inf_time_great = (inf_time_sec * mod_great_barracks * mod_trainer * mod_bonus) / inf_helmet
                const great_troops = Math.round(interval / inf_time_great * calculator.barracks.amount)
                inf_troops += great_troops
                cost.wood += inf.wood * great_troops * 3
                cost.clay += inf.clay * great_troops * 3
                cost.iron += inf.iron * great_troops * 3
                cost.crop += inf.crop * great_troops * 3
                cost.total += inf.total_res * great_troops * 3
                consumption += great_troops * inf.upkeep
            }
        }

        let cav_troops = 0
        if(calculator.stables.amount > 0) {
            const cav_time = cav.training_time.split(':')
            const cav_time_sec = Number(cav_time[0]) * 3600 + Number(cav_time[1]) * 60 + Number(cav_time[2])
            const mod_stables = Math.pow(0.9,calculator.stables.level - 1)
            const cav_helmet = 1 + calculator.stables.helmet / 100
            const hdt = (calculator.tribe === 'romans' ? 1 + calculator.stables.hdt_level / 100 : 1)
            const cav_time_mods = (cav_time_sec * mod_stables * mod_trainer * mod_bonus) / cav_helmet / hdt
            cav_troops = Math.round(interval / cav_time_mods * calculator.stables.amount)
            cost.wood += cav.wood * cav_troops
            cost.clay += cav.clay * cav_troops
            cost.iron += cav.iron * cav_troops
            cost.crop += cav.crop * cav_troops
            cost.total += cav.total_res * cav_troops
            consumption += cav_troops * cav.upkeep

            if(calculator.stables.great_level > 0) {
                const mod_great_stables = Math.pow(0.9,calculator.stables.great_level - 1)
                const cav_time_great = (cav_time_sec * mod_great_stables * mod_trainer * mod_bonus) / cav_helmet / hdt
                const gs_troops = Math.round(interval / cav_time_great * calculator.stables.amount)
                cav_troops += gs_troops
                cost.wood += cav.wood * gs_troops * 3
                cost.clay += cav.clay * gs_troops * 3
                cost.iron += cav.iron * gs_troops * 3
                cost.crop += cav.crop * gs_troops * 3
                cost.total += cav.total_res * gs_troops * 3
                consumption += gs_troops * cav.upkeep
            }
        }

        let siege_troops = 0
        if(calculator.workshop.amount > 0) {
            const siege_time = siege.training_time.split(':')
            const siege_time_sec = Number(siege_time[0]) * 3600 + Number(siege_time[1]) * 60 + Number(siege_time[2])
            const mod_workshop = Math.pow(0.9,calculator.workshop.level - 1)
            const siege_time_mods = (siege_time_sec * mod_workshop * mod_trainer * mod_bonus)
            siege_troops = Math.round(interval / siege_time_mods * calculator.workshop.amount)
            cost.wood += siege.wood * siege_troops
            cost.clay += siege.clay * siege_troops
            cost.iron += siege.iron * siege_troops
            cost.crop += siege.crop * siege_troops
            cost.total += siege.total_res * siege_troops
            consumption += siege_troops * siege.upkeep
        }

        return {
            consumption: consumption,
            cost: cost,
            inf: {
                type: inf ? inf.name : 'infantry',
                amount: inf_troops
            },
            cav: {
                type: cav ? cav.name : 'cavalry',
                amount: Math.round(cav_troops)
            },
            siege: {
                type: siege ? siege.name : 'siege',
                amount: Math.round(siege_troops)
            }
        }
    }

    const getInterval = (string) => {
        if(string === 'hour') return 1
        if(string === 'day') return 24
        if(string === 'week') return 168
    }
</script>

<template>
    <CalculatorWrapper :title="calculator.title" @new:title="(t) => calculator.title = t" @close:calculator="close">
        <div class="flex flex-col" v-on:change="handleSubmit">

            <TribeSelect :selected="calculator.tribe" @selection="(tribe) => {calculator.tribe = tribe}" class="mt-2" />

            <label class="px-4 mt-4">
                Training time
                <input type="number" min="0" max="300" v-model="calculator.training_amount" class="px-2 py-0.5 border w-20">
                <select v-model="calculator.time_type" class="border border-gray-500 px-1 ml-1">
                    <option v-for="days in ['hour', 'day', 'week']" v-bind:key="days">{{ days }}</option>
                </select>
            </label>

            <div class="flex mt-4">
                <label class="px-4">
                    Recruitment
                    <select v-model="calculator.recruitment" class="border border-gray-500 px-1 ml-1">
                        <option v-for="bonus in [0,2,4,6,8,10]" v-bind:key="bonus">{{ bonus }}</option>
                    </select>
                </label>
                <label class="px-4">
                    Artifact
                    <select v-model="calculator.artifact" class="border border-gray-500 px-1 ml-1">
                        <option v-for="arti in [0,25,50]" v-bind:key="arti">{{ arti }}</option>
                    </select>
                </label>
            </div>


            <div class="flex px-4 mt-4 bg-orange-100 py-3">
                <div class="flex border-r mr-4 border-gray-600 w-16">
                    <label class="">
                        <span class="text-xs font-semibold uppercase">Barracks</span><br/>
                        <select v-model="calculator.barracks.amount" class="border border-gray-500 px-1 mt-2">
                            <option v-for="(amount, index) in 30" v-bind:key="tribe">{{ index }}</option>
                        </select>
                    </label>
                </div>

                <div class="flex flex-col gap-1">
                    <div class="flex items-center">
                        <div class="w-14">Unit</div>
                        <select v-model="calculator.barracks.unit" class="border border-gray-500 px-1">
                            <option v-for="unit in getInf()" v-bind:key="unit">{{ unit.name }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Level</div>
                        <select v-model="calculator.barracks.level" class="border border-gray-500 px-1">
                            <option v-for="(level, index) in 20" v-bind:key="level">{{ level }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Helmet</div>
                        <select v-model="calculator.barracks.helmet" class="border border-gray-500 px-1">
                            <option v-for="helmet in [0,10,15,20]" v-bind:key="helmet">{{ helmet }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Great</div>
                        <select v-model="calculator.barracks.great_level" class="border border-gray-500 px-1">
                            <option v-for="(level, index) in 21" v-bind:key="level">{{ index }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="flex px-4 bg-emerald-100 py-3">
                <div class="flex border-r pr-4 mr-4 border-gray-600 w-16">
                    <label class="">
                        <span class="text-xs font-semibold uppercase">Stables</span><br/>
                        <select v-model="calculator.stables.amount" class="border border-gray-500 px-1 mt-2">
                            <option v-for="(amount, index) in 30" v-bind:key="tribe">{{ index }}</option>
                        </select>
                    </label>
                </div>

                <div class="flex flex-col gap-1">
                    <div class="flex items-center">
                        <div class="w-14">Unit</div>
                        <select v-model="calculator.stables.unit" class="border border-gray-500 px-1">
                            <option v-for="unit in getCav()" v-bind:key="unit">{{ unit.name }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Level</div>
                        <select v-model="calculator.stables.level" class="border border-gray-500 px-1">
                            <option v-for="(level, index) in 20" v-bind:key="level">{{ level }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Helmet</div>
                        <select v-model="calculator.stables.helmet" class="border border-gray-500 px-1">
                            <option v-for="helmet in [0,10,15,20]" v-bind:key="helmet">{{ helmet }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Great</div>
                        <select v-model="calculator.stables.great_level" class="border border-gray-500 px-1">
                            <option v-for="(level, index) in 21" v-bind:key="level">{{ index }}</option>
                        </select>
                    </div>
                    <div class="flex items-center" v-if="calculator.tribe === 'romans'">
                        <div class="w-14">HDT</div>
                        <select v-model="calculator.stables.hdt_level" class="border border-gray-500 px-1">
                            <option v-for="(level, index) in 21" v-bind:key="level">{{ index }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="flex px-4 bg-blue-100 py-3">
                <div class="flex border-r pr-4 mr-4 border-gray-600 w-16">
                    <label class="">
                        <span class="text-xs font-semibold uppercase">Siege</span><br/>
                        <select v-model="calculator.workshop.amount" class="border border-gray-500 px-1 mt-2">
                            <option v-for="(amount, index) in 30" v-bind:key="amount">{{ index }}</option>
                        </select>
                    </label>
                </div>

                <div class="flex flex-col gap-1">
                    <div class="flex items-center">
                        <div class="w-14">Unit</div>
                        <select v-model="calculator.workshop.unit" class="border border-gray-500 px-1">
                            <option v-for="unit in getSiege()" v-bind:key="unit">{{ unit.name }}</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <div class="w-14">Level</div>
                        <select v-model="calculator.workshop.level" class="border border-gray-500 px-1">
                            <option v-for="(level, index) in 20" v-bind:key="level">{{ level }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Troops</h2>
        <div class="bg-yellow-200 p-2">
            <template v-if="getTroops()">
                <span class="inline-block pr-1"><span class="font-semibold">{{ getTroops().inf.amount }}</span> {{ getTroops().inf.type }}</span>
                <span class="inline-block pr-1"><span class="font-semibold">{{ getTroops().cav.amount }}</span> {{ getTroops().cav.type }}</span>
                <span class="inline-block pr-1"><span class="font-semibold">{{ getTroops().siege.amount }}</span> {{ getTroops().siege.type }}</span><br/>
                <div class="flex mt-1 justify-between">
                    <div class="flex"><ResImg type="lumber" />{{ getTroops().cost.wood }}</div>
                    <div class="flex"><ResImg type="clay" />{{ getTroops().cost.clay }}</div>
                    <div class="flex"><ResImg type="iron" />{{ getTroops().cost.iron }}</div>
                    <div class="flex"><ResImg type="crop" />{{ getTroops().cost.crop }}</div>
                </div>
                <div class="flex mt-1 justify-between">
                    <div class="flex"><ResImg type="resources" />{{ getTroops().cost.total }}</div>
                    <div class="flex"><ResImg type="crop" />{{ getTroops().consumption }}/hr</div>
                </div>
            </template>
            <div v-else>
                Select troops
            </div>
        </div>

    </CalculatorWrapper>
</template>
