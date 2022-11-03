<script setup>
    import ResImg from '@/components/ResImg.vue'

    defineProps({
        resources: Object,
        total: Boolean
    })
</script>

<template>
    <div class="flex p-2 flex-wrap">
        <div class="flex mr-1"><ResImg type="lumber"></ResImg> {{ Math.ceil(resources.lumber) }}</div>
        <div class="flex mr-1"><ResImg type="clay"></ResImg> {{ Math.ceil(resources.clay) }}</div>
        <div class="flex mr-1"><ResImg type="iron"></ResImg> {{ Math.ceil(resources.iron) }}</div>
        <div class="flex mr-1"><ResImg type="crop"></ResImg> {{ Math.ceil(resources.crop) }}</div>
        <div class="w-full flex items-center border-t pt-1 mt-1" v-if="total">
            <ResImg type="resources"></ResImg> {{resources.lumber + resources.clay + resources.iron + resources.crop }}
        </div>
    </div>
</template>
