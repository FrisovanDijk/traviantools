<script setup>
    import ResImg from '@/components/ResImg.vue'
    import { ref, onBeforeMounted } from 'vue'

    const rows = ref([])
    const total = ref(
        {
            sum: 0,
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }
    )

    const addRow = () => {
        const newRow = {
            amount: 1,
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }

        rows.value.push(newRow)
    }

    onBeforeMounted(() => {
        addRow()
    })

    const resetTotal = () => {
        total.value = {
            sum: 0,
            lumber: 0,
            clay: 0,
            iron: 0,
            crop: 0
        }
    }

    const sumRows = () => {
        resetTotal()
        for(let i = 0; i < rows.value.length; i++) {
            let amount = rows.value[i].amount
            total.value.lumber += rows.value[i].lumber * amount
            total.value.clay += rows.value[i].clay * amount
            total.value.iron += rows.value[i].iron * amount
            total.value.crop += rows.value[i].crop * amount
            total.value.sum = total.value.lumber + total.value.clay + total.value.iron + total.value.crop
        }

        this.$emit('total', total.value)
    }

    const resetRows = () => {
        rows.value = []
        addRow()
        sumRows()
    }
</script>

<template>
        <div class="flex-grow flex flex-col">
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
</template>


