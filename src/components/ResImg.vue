<script setup>
    defineProps({
        type: String
    })
</script>

<template>
    <div class="flex items-center align-center">
        <img :src="`img/${type}.png`" :alt="$t(type)" :title="$t(type)" class="p-0.5" />
    </div>
</template>
