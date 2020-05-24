<template>
    <div class="m-4 border border-gray-500 rounded shadow-md bg-white" style="width: 300px">
        <h1 class="text-lg font-bold bg-green-600 text-gray-100 p-2">Hourly feeder traderoute</h1>

        <div class="bg-red-300 text-red-900 px-2 py-2" v-if="result.message != ''">
            {{ result.message }}
        </div>

        <div @submit.prevent="handleSubmit" class="flex flex-col mx-2 mt-2" v-on:change="handleSubmit">
            <h2>Production</h2>
            <div class="flex">
                <ResImg type="lumber"></ResImg>
                <input type="text" v-model="production.lumber" alt="lumber" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>
            <div class="flex">
                <ResImg type="clay"></ResImg>
                <input type="text" v-model="production.clay" alt="clay" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>
            <div class="flex">
                <ResImg type="iron"></ResImg>
                <input type="text" v-model="production.iron" alt="iron" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>
            <div class="flex">
                <ResImg type="crop"></ResImg>
                <input type="text" v-model="production.crop" alt="crop" class="border border-gray-600 rounded-sm px-2 m-1">
            </div>

            <label class="mt-1">
                Party:
                <select v-model="party" class="border border-gray-500 px-1">
                    <option>none</option>
                    <option>small</option>
                    <option>great</option>
                </select>
            </label>
            <label class="mt-1">
                Town Hall:
                <select v-model="townHall" class="border border-gray-500 px-1">
                    <option v-for="level in 20" v-bind:key="level">{{ level }}</option>
                </select>
            </label>
        </div>

        <h2 class="mt-2 py-1 mx-2 font-bold">Hourly traderoute</h2>
        <ResList class="bg-yellow-200"
            :resources="result"
        ></ResList>
    </div>
</template>

<script>
    import ResImg from './atoms/ResImg.vue'
    import ResList from './molecules/ResList.vue'

    export default {
        name: 'FeederTraderoutes',
        components: {
            ResImg,
            ResList
        },
        data() {
            return {
                production: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                },
                party: "none",
                townHall: 1,
                result: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0,
                    message: ""
                }
            }
        },
        methods: {
            handleSubmit() {
                this.result.message = ""

                const celebration = this.celebrationCost(this.party, this.townHall)

                this.result.lumber = this.production.lumber - celebration.lumber
                this.result.clay = this.production.clay - celebration.clay
                this.result.iron = this.production.iron - celebration.iron
                this.result.crop = this.production.crop - celebration.crop

                if(isNaN(this.result.lumber) || isNaN(this.result.clay)
                        || isNaN(this.result.iron) || isNaN(this.result.crop)
                ) { this.result.message = "Please enter numbers (copying may fail)"}
            },
            celebrationCost(type, level) {
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
                    let duration = this.celebrationDuration(celebrations.small_celebration.base_time, level)
                    lumber = celebrations.small_celebration.lumber / duration
                    clay = celebrations.small_celebration.clay / duration
                    iron = celebrations.small_celebration.iron / duration
                    crop = celebrations.small_celebration.crop / duration
                }
                if(type === "great") {
                    let duration = this.celebrationDuration(celebrations.great_celebration.base_time, level)
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
            },
            celebrationDuration(base_time, level) {
                const timesplit = base_time.split(':')
                const seconds = (+timesplit[0]) * 60 * 60 + (+timesplit[1]) * 60 + (+timesplit[2])

                return seconds * Math.pow(0.964, level - 1) / 3600
            }
        }
    }
</script>