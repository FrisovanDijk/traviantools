<script setup>
    defineProps({
        legend: String,
        options: {
            type: Array,
            default: () => ['']
        },
        selected: ''
    })

    const name = Math.random().toString(36).slice(5)
</script>

<template>
    <div class="flex space-x-3 items-center text-sm">
        <legend class="w-16">{{ legend }}</legend>

        <div v-for="option in options" :key="option">
            <span :for="option"
                   class="block rounded border text-center py-0.5 px-1 cursor-pointer hover:bg-green-100 border-gray-500"
                   :class="(option === selected ? 'bg-green-200' : 'bg-gray-100')"
                   @click="$emit('selection', option)"
            >
                {{ option }}
            </span>
        </div>
    </div>
</template>
