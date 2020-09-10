<template>
    <CardContainer title="Building cost" @close:view="$emit('close:view')">
        <div class="flex justify-between text-sm uppercase mb-1 px-2">
            <div class="flex"><div class="mr-8 pr-1">#</div>Building</div>
            <div class="flex"><div class="mr-6 pr-1">From</div>To</div>
        </div>
        <div v-for="(selection, index) in selections"
             :key="index"
             class="flex mb-2 justify-between px-2"
             @change="updateTotals"
        >

            <select class="w-10 flex-shrink-0 border border-gray-600 mr-1 text-sm"
                    v-model="selection.amount"
            >
                <option v-for="n in 15"
                        :key="n"
                >
                    {{ n }}
                </option>
            </select>

            <select class="w-40 border-gray-600 border mr-1 text-sm"
                    v-model="selection.name"
            >
                <option v-for="(building,key) in buildings"
                        :key="key"
                        :selected="selection.name === key"
                >
                    {{ key }}
                </option>
            </select>

            <select class="border border-gray-600 w-10 flex-shrink-0 text-sm mr-1"
                    v-model="selection.fromLevel"
            >
                <option v-for="(level,key) in buildings[selection.name]"
                        :key="key"
                        :selected="selection.name === key"
                >
                    {{ level.level - 1 }}
                </option>
            </select>

            <select class="border border-gray-600 w-10 flex-shrink-0 text-sm"
                    v-model="selection.toLevel"
            >
                <option v-for="(level,key) in buildings[selection.name]"
                        :key="key"
                        :selected="selection.name === key"
                >
                    {{ level.level }}
                </option>
            </select>
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
        <div class="bg-yellow-200 p-2 pt-0">
            <div class="flex">+{{total.cp}} CP. <ResImg class="-mr-1" type="resources"></ResImg>/CP: {{ total.cpRes }}</div>
        </div>
    </CardContainer>

</template>

<script>
    import ResImg from "./atoms/ResImg";
    import ResList from './molecules/ResList.vue'
    import buildingsJson from '../data/buildings.json'
    import CardContainer from "./molecules/CardContainer"

    export default {
        name: 'NPCCalculator',
        components: {
            ResList,
            CardContainer,
            ResImg
        },
        data() {
            return {
                buildings: buildingsJson,
                selections: [],
                total: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0,
                    cp: 0,
                    cpRes: 0
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
                    crop: 0,
                    cp: 0,
                    cpRes: 0
                }

                for(let i = 0; i < this.selections.length; i++) {
                    const subtotal = {
                        lumber: 0,
                        clay: 0,
                        iron: 0,
                        crop: 0,
                        cp: 0,
                        cpRes: 0
                    }

                    const item = this.selections[i]
                    if(Number(item.toLevel) <= Number(item.fromLevel)) item.toLevel = Number(item.fromLevel)+1

                    for(let j = item.fromLevel; j <= item.toLevel - 1; j++) {
                        const res = this.buildings[item.name][j]
                        subtotal.lumber += res.wood
                        subtotal.clay += res.clay
                        subtotal.iron += res.iron
                        subtotal.crop += res.crop
                        subtotal.cp += res.cp_diff
                    }

                    total.lumber += subtotal.lumber * item.amount
                    total.clay   += subtotal.clay * item.amount
                    total.iron   += subtotal.iron * item.amount
                    total.crop   += subtotal.crop * item.amount
                    total.cp     += subtotal.cp * item.amount
                }

                total.cpRes = Math.round(((total.lumber + total.clay + total.iron + total.crop) / total.cp)*100)/100

                this.total = total
            },
            addSelection() {
                this.selections.push({
                    amount: 1,
                    name: 'Barracks',
                    fromLevel: 0,
                    toLevel: 1
                })
                this.updateTotals()
            },
            resetRows() {
                this.selections = [{
                    amount: 1,
                    name: 'Barracks',
                    fromLevel: 0,
                    toLevel: 1
                }]
                this.updateTotals()
            }
        }
    }
</script>
