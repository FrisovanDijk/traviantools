<script setup>

    const menu = [
        {
            name: 'NPCCalculator',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />\n' +
                '</svg>\n',
            calculator: {
                title: 'Building cost',
                selections: []
            }
        },
        {
            name: 'FeederAutomation',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />\n' +
                '</svg>\n',
            calculator: {
                title: 'Feeder traderoutes',
                production: {
                    lumber: 0,
                    clay: 0,
                    iron: 0,
                    crop: 0
                },
                party: "none",
                townHall: 1,
                hours: 1
            }
        },
        {
            name: 'VillageTimer',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />\n' +
                '</svg>\n',
            calculator: {
                title: 'Time to next village',
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
                title: 'Number of merchant trips',
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
                title: 'Total resources',
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
            name: 'ROICalculator',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />\n' +
                '</svg>\n',
            calculator: {
                title: 'Return on Investment',
                roiType: 'field',
                fieldType: 'crop',
                bonusBuilding: 0,
                fieldToLevel: 1,
                oases: [
                    {
                        type1: '',
                        type2: ''
                    },{
                        type1: '',
                        type2: ''
                    },{
                        type1: '',
                        type2: ''
                    }
                ],
                goldBonus: true,
                buildingType: 'crop',
                buildingToLevel: 1,
                simulateFieldTo10: true,
                fields: {
                    crop: [{level: 10, amount: 6}],
                    lumber: [{level: 10, amount: 4}],
                    clay: [{level: 10, amount: 4}],
                    iron: [{level: 10, amount: 4}]
                },
                hmToLevel: 10,
                hmOasis: {
                    type1: 'crop',
                    type2: ''
                }
            }
        },
        {
            name: 'ProductionOverview',
            icon: 'Pro',
            calculator: {
                title: 'Village Production',
                level: {
                    clay: 10,
                    lumber: 10,
                    iron: 10,
                    crop: 10,
                },
                building: {
                    clay: 5,
                    lumber: 5,
                    iron: 5,
                    crop: 10,
                    egyptian: 0
                },
                oases: [
                    {
                        type1: '',
                        type2: ''
                    },{
                        type1: '',
                        type2: ''
                    },{
                        type1: '',
                        type2: ''
                    }
                ],
                goldBonus: true,
                villagetype: {
                    lumber: 1,
                    clay: 1,
                    iron: 1,
                    crop: 15
                },
            }
        },
        {
            name: 'UltimateROI',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">' +
                '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />' +
                '</svg>',
            calculator: {
                title: 'Optimal village builder',
                villagetype: {
                    "lumber": 1,
                    "clay": 1,
                    "iron": 1,
                    "crop": 15
                },
                oases: [
                    {
                        type1: '',
                        type2: ''
                    },{
                        type1: '',
                        type2: ''
                    },{
                        type1: '',
                        type2: ''
                    }
                ],
                egyptian: false,
                goldBonus: true,
                simTo: 10,
                build: [],
                tab: 0
            }
        },
        {
            name: 'TroopsTraining',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />\n' +
                '</svg>\n',
            calculator: {
                title: 'Troop training',
                tribe: 'gaul',
                barracks: {
                    unit: 'Phalanx',
                    level: 20,
                    helmet: 0,
                    amount: 1,
                    great_level: 0
                },
                stables: {
                    unit: 'Druidrider',
                    level: 20,
                    helmet: 0,
                    amount: 1,
                    great_level: 0,
                    hdt_level: 0
                },
                workshop: {
                    unit: 'Ram',
                    level: 20,
                    amount: 0
                },
                recruitment: 0,
                artifact: 0,
                training_amount: 1,
                time_type: 'hour'
            }
        },
        {
            name: 'TroopCost',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
                '  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />\n' +
                '</svg>\n',
            calculator: {
                title: 'Troop costs',
                tribe: 'gaul',
                units: [
                    {
                        name: 'Phalanx',
                        amount: 100
                    }
                ],
                recruitment: 0,
                artifact: 0,
                helm_inf: 0,
                helm_cav: 0,
                hospital_level: 20
            }
        },
        {
            name: 'TroopsCompare',
            icon: 'TCo',
            calculator: {
                title: 'Compare troops',
                tribe: 'gaul',
                upgrade_level: 20,
                recruitment: 10,
                boots: 0,
                hospital_level: 20,
                hdt: 20,
                brewery: 10,
                items: 3
            }
        },
        {
            name: 'SmithyEfficiency',
            icon: 'SEf',
            calculator: {
                title: 'Smithy efficiency',
                tribe: 'gaul',
                units: [false,false,false,false,false,false,false,false],
                smithy: true,
                level: 20
            }
        },
    ]
</script>

<template>
    <div class="flex flex-col space-y-2">
        <div class="bg-emerald-600 text-white p-2 rounded cursor-pointer hover:bg-emerald-400"
             v-for="item in menu"
             @click="$emit('add:calculator', {name: item.name, calculator: item.calculator})">
            <span v-html="item.icon" />
        </div>

        <hr class="border-slate-800">

        <div class="bg-sky-600 text-white p-2 rounded cursor-pointer hover:bg-sky-400" @click="$emit('add:calculator', { name: 'Help' } )">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        </div>

        <hr class="border-slate-800">

        <div class="bg-rose-600 text-white p-2 rounded cursor-pointer hover:bg-rose-400" @click="$emit('clear:tab')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        </div>
    </div>
</template>
