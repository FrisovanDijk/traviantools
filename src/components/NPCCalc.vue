<template>
    <div class="my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 300px">
        <h1 class="text-lg font-bold bg-green-600 text-gray-100 p-2">Total resources</h1>

        <div class="mt-2 flex-grow flex flex-col">
            <div class="flex justify-between px-6">
                <span class="mr-2">#</span>
                <ResImg type="lumber"></ResImg>
                <ResImg type="clay"></ResImg>
                <ResImg type="iron"></ResImg>
                <ResImg type="crop"></ResImg>
            </div>
            <div class="flex justify-between px-2 pb-1"
                 v-for="(row, index) in rows"
                 :key="index"
                 v-on:change="sumRows"
            >
                <input type="text" v-model="row.amount" style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm mr-2">
                <input type="text" v-model="row.lumber" style="width: 3.3rem; padding: 0 0.1rem; background-color: rgb(255,222,173)" class="pl-1 border border-gray-300 text-sm">
                <input type="text" v-model="row.clay"   style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm bg-red-200">
                <input type="text" v-model="row.iron"   style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm bg-gray-200">
                <input type="text" v-model="row.crop"   style="width: 3.3rem; padding: 0 0.1rem" class="px-1 border border-gray-300 text-sm bg-yellow-200">
            </div>

            <div class="flex justify-end mt-1 mx-2">
                <button class="bg-red-600 hover:bg-red-400 px-2 pb-1 rounded text-md text-white mr-1" @click="resetRows">reset</button>
                <button class="bg-green-600 hover:bg-green-400 px-2 pb-1 rounded text-md text-white" @click="addRow">add row</button>
            </div>
        </div>



        <h2 class="mt-2 py-1 mx-2 font-bold">Total sum</h2>
        <ResList class="bg-yellow-200"
                 :resources="total"
                 :total="true"
        ></ResList>
    </div>
</template>

<script>
    import ResImg from './atoms/ResImg.vue'
    import ResList from './molecules/ResList.vue'

    export default {
        name: 'NPCCalc',
        components: {
            ResImg,
            ResList
        },
        data() {
            return {
                rows: [],
                total: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            }
        },
        mounted() {
            this.addRow()
        },
        methods: {
            addRow() {
                const newRow = {
                    amount: 1,
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }

                this.rows.push(newRow)
            },
            sumRows() {
                this.resetTotal()
                for(let i = 0; i < this.rows.length; i++) {
                    let amount = this.rows[i].amount
                    this.total.lumber += this.rows[i].lumber * amount
                    this.total.clay += this.rows[i].clay * amount
                    this.total.iron += this.rows[i].iron * amount
                    this.total.crop += this.rows[i].crop * amount
                }
            },
            resetTotal() {
                this.total = {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            },
            resetRows() {
                this.rows = []
                this.addRow()
                this.resetTotal()
            }
        }
    }
</script>