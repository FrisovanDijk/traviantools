<template>
    <ul class="max-w-full mx-auto mt-4 rounded text-white font-semibold uppercase text-sm flex flex-wrap justify-between">
        <AppMenuBarItem v-for="(item, index) in menuitems"
                        :key="index"
                        :name="item.text"
                        @clicked="$emit('add', item.name)"
        ></AppMenuBarItem>
        <AppMenuBarItem :name="'reset'"
                        @clicked="$emit('reset')"
        ></AppMenuBarItem>
    </ul>
</template>

<script>
    import AppMenuBarItem from "./AppMenuBarItem";

    export default {
        name: 'AppMenuBar',
        components: {
            AppMenuBarItem
        },
        data() {
            return {
                menuitems: [
                    {
                        name: 'NPCCalculator',
                        text: 'Buildings'
                    },
                    {
                        name: 'FeederTraderoutes',
                        text: 'Feeder automation'
                    },
                    {
                        name: 'CPNextVillage',
                        text: 'Next village timer'
                    },
                    {
                        name: 'MerchantCalc',
                        text: 'Merchant trips'
                    },
                    {
                        name: 'CropScouter',
                        text: 'Cropscout'
                    },
                    {
                        name: 'TotalResources',
                        text: 'Total res'
                    }
                ]
            }
        }
    }
</script>
