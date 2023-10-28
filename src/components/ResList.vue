<script setup>
    import ResImg from '@/components/ResImg.vue'

    const props = defineProps({
        resources: Object,
        total: Boolean
    })

    const getTotal = () => {
        return Math.ceil(props.resources.lumber) + Math.ceil(props.resources.clay) + Math.ceil(props.resources.iron) + Math.ceil(props.resources.crop)
    }

    const getNoCropTotal = () => {
        return Math.ceil(props.resources.lumber) + Math.ceil(props.resources.clay) + Math.ceil(props.resources.iron)
    }
</script>

<template>
    <div class="flex p-2 flex-wrap">
        <div class="flex mr-1"><ResImg type="lumber"></ResImg> {{ Math.ceil(resources.lumber) }}</div>
        <div class="flex mr-1"><ResImg type="clay"></ResImg> {{ Math.ceil(resources.clay) }}</div>
        <div class="flex mr-1"><ResImg type="iron"></ResImg> {{ Math.ceil(resources.iron) }}</div>
        <div class="flex mr-1"><ResImg type="crop"></ResImg> {{ Math.ceil(resources.crop) }}</div>
        <div class="w-full flex items-center justify-between border-t pt-1 mt-1" v-if="total">
            <div class="flex"><ResImg type="resources"></ResImg> {{getTotal()}}</div>
            <div class="flex"><ResImg type="nocrop"></ResImg>{{getNoCropTotal()}}</div>
        </div>
    </div>
</template>
