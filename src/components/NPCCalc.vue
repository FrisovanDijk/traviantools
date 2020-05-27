<template>
    <div class="my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 300px">
        <h1 class="text-lg font-bold bg-green-600 text-gray-100 p-2">Total resources</h1>

        <ResRowSum @total="setTotal"></ResRowSum>

        <h2 class="mt-2 py-1 mx-2 font-bold">Total sum</h2>
        <ResList class="bg-yellow-200"
                 :resources="total"
                 :total="true"
        ></ResList>
    </div>
</template>

<script>
    import ResRowSum from './molecules/ResRowSum.vue'
    import ResList from './molecules/ResList.vue'

    export default {
        name: 'NPCCalc',
        components: {
            ResRowSum,
            ResList
        },
        data() {
            return {
                total: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            }
        },
        methods: {
            setTotal(total) {
                this.total = total
            }
        }
    }
</script>