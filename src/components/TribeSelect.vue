<script setup>
    defineProps({
        selected: {
            type: String,
            default: 'gauls'
        }
    })

    const tribes = ['romans', 'gaul', 'teutons', 'egyptians', 'huns']
</script>

<template>
    <div class="px-4 flex space-x-2 items-center text-sm">
        <div class="w-8">Tribe</div>

        <div v-for="(option, index) in tribes" :key="option"
             class="block rounded border text-center py-0.5 px-1 cursor-pointer hover:bg-green-100 border-gray-500 overflow-hidden"
             :class="(option === selected ? 'bg-green-200' : 'bg-gray-100')"
             @click="$emit('selection', option)"
        >
            <div :style="`background-image: url('img/tribes.png'); background-position: -${index * 22}px 0; height: 22px; width: 22px;`"></div>
        </div>
    </div>
</template>
