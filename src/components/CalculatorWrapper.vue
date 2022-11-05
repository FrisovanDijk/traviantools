<script setup>
    defineProps({
        title: {
            type: String,
            default: 'Title'
        },
        close: {
            type: Boolean,
            default: true
        }
    })
</script>

<template>
    <div class="relative my-4 sm:mx-4 border rounded-lg overflow-hidden shadow-md flex flex-col bg-white" style="width: 310px">
        <div class="bg-rose-800 hover:bg-rose-600 text-white absolute rounded px-2 font-semibold flex items-center justify-center cursor-pointer"
             style="right: 4px; top: 4px; width: 22px; height: 22px;"
             @click="$emit('close:calculator')"
             v-if="close"
        >
            <div style="margin-top: -1px;">X</div>
        </div>
        <h1 class="font-semibold bg-emerald-600 text-gray-100 p-2 mb-2">{{ title }}</h1>

        <slot></slot>
    </div>
</template>
