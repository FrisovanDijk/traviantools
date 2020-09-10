<template>
    <div class="my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 300px">
        <h1 class="text-lg font-semibold bg-green-600 text-gray-100 p-2">Cropscouter</h1>

        <div class="mt-2 border-b border-gray-800 flex-grow flex flex-col"
             v-for="(cropscout, index) in cropscouts"
             :key="index"
        >
            <div class="flex mx-2 text-sm">
                Name<input type="text" v-model="cropscout.name" class="ml-2 px-1 border border-gray-300 flex-grow">
            </div>
            <div class="flex justify-between px-6">
                <span class="-ml-1 mr-1 text-sm">time</span>
                <ResImg type="lumber"></ResImg>
                <ResImg type="clay"></ResImg>
                <ResImg type="iron"></ResImg>
                <ResImg type="crop"></ResImg>
            </div>
            <div class="flex justify-between px-2 pb-1"
                 v-for="(scout, i) in cropscout.scouts"
                 :key="i"
                 v-on:change="productionCalc(cropscout)"
            >
                <input type="text" v-model="scout.second" style="width: 3.3rem; padding: 0 0.1rem" class="border border-gray-300 text-sm mr-2">
                <input type="text" v-model="scout.lumber" style="width: 3.3rem; padding: 0 0.1rem; background-color: rgb(255,222,173)" class="border border-gray-300 text-sm">
                <input type="text" v-model="scout.clay"   style="width: 3.3rem; padding: 0 0.1rem" class="border border-gray-300 text-sm bg-red-200">
                <input type="text" v-model="scout.iron"   style="width: 3.3rem; padding: 0 0.1rem" class="border border-gray-300 text-sm bg-gray-200">
                <input type="text" v-model="scout.crop"   style="width: 3.3rem; padding: 0 0.1rem" class="border border-gray-300 text-sm bg-yellow-200">
            </div>

            <div class="flex justify-end mt-1 mx-2">
                <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetSingle(cropscout)">reset</button>
            </div>

            <h2 class="pb-1 mx-2 font-bold">Production</h2>
            <ResList class="bg-yellow-200"
                     :resources="cropscout.production"
            ></ResList>
        </div>

        <div class="flex justify-end m-2">
            <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetAll">reset all</button>
            <button class="bg-blue-600 hover:bg-blue-400 px-2 pb-1 rounded text-md text-white" @click="addCropscout">add target</button>
        </div>
    </div>
</template>

<script>
    import ResImg from './atoms/ResImg.vue'
    import ResList from './molecules/ResList.vue'

    export default {
        name: 'CropScouter',
        components: {
            ResImg,
            ResList
        },
        data() {
            return {
                cropscouts: []
            }
        },
        mounted() {
            this.addCropscout()
        },
        methods: {
            addCropscout() {
                this.cropscouts.push(this.getEmptyCropscout())
            },
            productionCalc(cropscout) {
                let dt = cropscout.scouts[1].second - cropscout.scouts[0].second,
                    dlumber = cropscout.scouts[1].lumber - cropscout.scouts[0].lumber,
                    dclay = cropscout.scouts[1].clay - cropscout.scouts[0].clay,
                    diron = cropscout.scouts[1].iron - cropscout.scouts[0].iron,
                    dcrop = cropscout.scouts[1].crop - cropscout.scouts[0].crop

                cropscout.production = {
                    lumber: Math.round((3600*dlumber/dt)),
                    clay: Math.round((3600*dclay/dt)),
                    iron: Math.round((3600*diron/dt)),
                    crop: Math.round((3600*dcrop/dt))
                }
            },
            resetSingle(cropscout) {
                this.cropscouts[this.cropscouts.indexOf(cropscout)].scouts = this.getEmptyCropscout().scouts
            },
            resetAll() {
                this.cropscouts = [this.getEmptyCropscout()]
            },
            getEmptyCropscout() {
                return {
                    name: '',
                    scouts: [
                        {
                            second: 0,
                            lumber: 0,
                            clay: 0,
                            iron: 0,
                            crop: 0
                        },
                        {
                            second: 0,
                            lumber: 0,
                            clay: 0,
                            iron: 0,
                            crop: 0
                        }
                    ],
                    production: {
                        lumber: 0,
                        clay: 0,
                        iron: 0,
                        crop: 0
                    }
                }
            }
        }
    }
</script>
