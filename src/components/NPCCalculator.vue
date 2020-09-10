<template>
    <div class="my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 300px">
        <h1 class="text-lg font-semibold bg-green-600 text-gray-100 p-2">NPC Calculator</h1>

        <div class="p-2">
            <div class="flex justify-between text-sm uppercase">
                <div>Building</div>
                <div>Level</div>
            </div>
            <div v-for="(selection, index) in selections"
                 :key="index"
                 class="flex mt-2 justify-between"
                 @change="updateTotals"
            >

                <select class="w-full border-gray-600 border mr-4"
                        v-model="selection.name"
                >
                    <option v-for="(building,key) in buildings"
                            :key="key"
                            :selected="selection.name === key"
                    >
                        {{ key }}
                    </option>
                </select>

                <select class="border border-gray-600 w-12 flex-shrink-0"
                        v-model="selection.level"
                >
                    <option v-for="(level,key) in buildings[selection.name]"
                            :key="key"
                            :selected="selection.name === key"
                    >
                        {{ level.level }}
                    </option>
                </select>

            </div>
        </div>

        <div class="flex justify-end mt-1 mx-2">
            <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetRows">reset</button>
            <button class="bg-green-600 hover:bg-green-400 px-2 pb-1 rounded text-md text-white" @click="addSelection">add row</button>
        </div>


        <h2 class="mt-2 py-1 mx-2 font-bold">Total sum</h2>
        <ResList class="bg-yellow-200"
                 :resources="total"
                 :total="true"
        ></ResList>
    </div>
</template>

<script>
    import ResList from './molecules/ResList.vue'
    import buildingsJson from '../data/buildings.json'

    export default {
        name: 'NPCCalculator',
        components: {
            ResList
        },
        data() {
            return {
                buildings: buildingsJson,
                selections: [],
                total: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            }
        },
        mounted() {
            this.addSelection()
        },
        methods: {
            updateTotals() {
                const total = {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }

                for(let i = 0; i < this.selections.length; i++) {
                    const totalres = this.buildings[this.selections[i].name][this.selections[i].level - 1]
                    total.lumber += totalres.wood
                    total.clay += totalres.clay
                    total.iron += totalres.iron
                    total.crop += totalres.crop
                }

                this.total = total
            },
            addSelection() {
                this.selections.push({
                    name: 'Barracks',
                    level: 1
                })
                this.updateTotals()
            },
            resetRows() {
                this.selections = [{
                    name: 'Barracks',
                    level: 1
                }]
                this.updateTotals()
            }
        }
    }
</script>
