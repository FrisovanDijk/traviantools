<template>
    <div class="my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 300px">
        <h1 class="text-lg font-bold bg-green-600 text-gray-100 p-2">Merchant trips</h1>

        <div class="mt-2 flex-grow flex flex-col" @change="calcMerchants">
            <ResRowSum @total="updateTotal"></ResRowSum>

            <label class="mt-2 mx-2 flex items-baseline">
                Merchants:
                <select v-model="merchants" class="border border-gray-500 px-1 ml-1">
                    <option v-for="available in 20" :key="available">{{ available }}</option>
                </select>
            </label>
            <label class="mt-2 mx-2 flex items-baseline">
                Capacity:
                <input type="text" v-model="capacity" class="border border-gray-600 rounded-sm px-2 ml-1">
            </label>
        </div>



        <h2 class="mt-2 py-1 mx-2 font-bold">Merchant trips</h2>
        <div class="bg-yellow-200">
            <div class="px-3 pt-2 pb-1"><span class="font-bold">{{ trip.trips }}</span> trips of</div>
            <ResList :resources="trip" class="pt-0"></ResList>
        </div>
    </div>
</template>

<script>
    import ResRowSum from './molecules/ResRowSum.vue'
    import ResList from './molecules/ResList.vue'

    export default {
        name: 'MerchantCalc',
        components: {
            ResRowSum,
            ResList
        },
        data() {
            return {
                merchants: 20,
                capacity: 500,
                total: {
                    sum: 0,
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                },
                trip: {
                    trips: 0,
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                }
            }
        },
        methods: {
            calcMerchants() {
                const capacity = this.merchants * this.capacity
                const trips = Math.ceil(this.total.sum / capacity)

                this.trip = {
                    trips: trips,
                    lumber: this.total.lumber / trips,
                    clay: this.total.clay / trips,
                    iron: this.total.iron / trips,
                    crop: this.total.crop / trips
                }
            },
            updateTotal(total) {
                this.total = total
            }
        }
    }
</script>