<script setup>
    defineProps({
        title: {
            type: String,
            default: 'Title'
        }
    })
</script>

<template>
    <div class="relative my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 310px">
        <div class="bg-red-800 hover:bg-red-600 text-white absolute rounded-full px-2 font-semibold flex items-center justify-center cursor-pointer"
             style="right: -7px; top: -7px; width: 24px; height: 24px;"
             @click="$emit('close:calculator')"
        >
            <div style="margin-top: -1px;">X</div>
        </div>
        <h1 class="text-lg font-semibold bg-green-600 text-gray-100 p-2 mb-2">{{ title }}</h1>

        <slot></slot>
    </div>
</template>
