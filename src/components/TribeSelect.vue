<script setup>
    defineProps({
        selected: {
            type: String,
            default: 'gaul'
        }
    })

    const tribes = ['romans', 'gaul', 'teutons', 'egyptians', 'huns']
</script>

<template>
    <div class="px-4 flex gap-4 justify-center text-sm">
        <div v-for="(option, index) in tribes" :key="option"
             class="block rounded border text-center py-0.5 px-2 cursor-pointer hover:bg-green-100 border-gray-500 overflow-hidden"
             :class="(option === selected ? 'bg-green-200' : 'bg-gray-100')"
             @click="$emit('selection', option)"
        >
            <div :style="`background-image: url('img/tribes.png'); background-position: -${index * 22}px 0; height: 22px; width: 22px;`" role="img" :alt="$t(option)" :title="$t(option)"></div>
        </div>
    </div>
</template>
