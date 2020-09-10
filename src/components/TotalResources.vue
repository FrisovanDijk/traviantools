<template>
    <CardContainer title="Total resources" @close:view="$emit('close:view')">
        <ResRowSum @total="setTotal"></ResRowSum>

        <h2 class="mt-2 py-1 mx-2 font-bold">Total sum</h2>
        <ResList class="bg-yellow-200"
                 :resources="total"
                 :total="true"
        ></ResList>
    </CardContainer>
</template>

<script>
    import ResRowSum from './molecules/ResRowSum.vue'
    import ResList from './molecules/ResList.vue'
    import CardContainer from "./molecules/CardContainer";

    export default {
        name: 'TotalResources',
        components: {
            ResRowSum,
            ResList,
            CardContainer
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
