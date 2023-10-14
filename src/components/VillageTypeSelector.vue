<script setup>
    import ResImg from "@/components/ResImg.vue";
    import { ref } from 'vue'

    import village_types from '@/data/village_types.json'

    defineProps({
        selected: {
            type: Object,
            default: () => {return {
                "crop": 15,
                "lumber": 1,
                "clay": 1,
                "iron": 1
            }}
        },
        index: {
            type: Number,
            default: 0
        }
    })

    const villages = village_types

    const open = ref(false)
</script>

<template>
    <div class="relative">
        <div class="cursor-pointer bg-gray-200 h-6 w-36 border border-gray-600 flex items-center justify-between px-1" @click="open = !open">
            {{ selected.lumber }}<ResImg type="lumber" />
            {{ selected.clay }}<ResImg type="clay" />
            {{ selected.iron }}<ResImg type="iron" />
            {{ selected.crop }}<ResImg type="crop" />
            <div class="">
                &#709;
            </div>
        </div>
        <div class="absolute bg-white cursor-pointer overflow-y-scroll h-32 w-36 border rounded z-50"
             v-if="open"
        >
            <div class="flex hover:bg-yellow-100 py-1"
                 v-for="(type, i) in village_types"
                 :key="i"
                 @click="open = false; $emit('selection', { type: type, i: index })"
            >
                {{ type.lumber }}<ResImg type="lumber" />
                {{ type.clay }}<ResImg type="clay" />
                {{ type.iron }}<ResImg type="iron" />
                {{ type.crop }}<ResImg type="crop" />
            </div>
        </div>
    </div>
</template>
