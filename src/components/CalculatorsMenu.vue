<script setup>

    const menu = [
        {
            name: 'NPCCalculator',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />\n' +
                '</svg>\n',
            calculator: {
                selections: []
            }
        },
        {
            name: 'FeederAutomation',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />\n' +
                '</svg>\n',
            calculator: {
                production: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                },
                party: "none",
                townHall: 1
            }
        },
        {
            name: 'VillageTimer',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />\n' +
                '</svg>\n',
            calculator: {
                cpLeft: 0,
                cpDaily: 0,
                helmet: 'None',
                parties: [{
                    amount: 0,
                    type: 'Small',
                    cp: 500,
                    townHall: 1
                }]
            }
        },
        {
            name: 'MerchantTrips',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />\n' +
                '</svg>\n',
            calculator: {
                merchants: 20,
                capacity: 500,
                rows: [
                    {
                        amount: 1,
                        lumber: 0,
                        clay: 0,
                        iron: 0,
                        crop: 0
                    }
                ]
            }
        },
        {
            name: 'TotalResources',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />\n' +
                '</svg>\n',
            calculator: {
                name: 'TotalResources'
            }
        }
    ]
</script>

<template>
    <div class="flex flex-col space-y-2">
        <div class="bg-emerald-600 text-white p-2 rounded cursor-pointer hover:bg-emerald-400" v-for="item in menu" @click="$emit('add:calculator', item)">
            <span v-html="item.icon" />
        </div>
    </div>
</template>
