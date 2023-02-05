<script setup>
    import ResImg from "@/components/ResImg.vue";
    import { ref } from 'vue'

    defineProps({
        selected: {
            type: Object,
            default: () => {return {
                type1: '', type2: ''
            }}
        },
        index: Number
    })

    const oases = [
        {
            type1: '',
            type2: ''
        },{
            type1: 'crop',
            type2: ''
        },
        {
            type1: 'crop',
            type2: 'crop'
        },
        {
            type1: 'lumber',
            type2: 'crop'
        },
        {
            type1: 'clay',
            type2: 'crop'
        },
        {
            type1: 'iron',
            type2: 'crop'
        },
        {
            type1: 'lumber',
            type2: ''
        },
        {
            type1: 'clay',
            type2: ''
        },
        {
            type1: 'iron',
            type2: ''
        },
        {
            type1: 'lumber',
            type2: 'lumber'
        },
        {
            type1: 'clay',
            type2: 'clay'
        },
        {
            type1: 'iron',
            type2: 'iron'
        }
    ]

    const open = ref(false)
</script>

<template>
    <div class="relative">
        <div class="cursor-pointer bg-gray-200 h-6 w-12 border border-gray-600 flex items-center justify-between px-1" @click="open = !open">
            <template v-if="selected.type1 === ''">
                -
            </template>
            <template v-else>
                <ResImg :type="`${selected.type1}${selected.type2}`" />
            </template>
            <div class="">
                &#709;
            </div>
        </div>
        <div class="absolute bg-white cursor-pointer overflow-y-scroll h-32 w-12 border rounded z-50"
             v-if="open"
        >
            <div class="flex hover:bg-yellow-100 py-1"
                 v-for="(oasis, i) in oases"
                 :key="i"
                 @click="open = false; $emit('selection', { type: oasis, i: index })"
            >
                <template v-if="oasis.type1 === ''">
                    -
                </template>
                <template v-else>
                    <ResImg :type="`${oasis.type1}${oasis.type2}`" />
                </template>
            </div>
        </div>
    </div>
</template>
