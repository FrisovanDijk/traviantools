<script setup>
    defineProps({
        type: String
    })
</script>

<template>
    <div class="flex items-center align-center">
        <img :src="`img/${type}.png`" alt="" class="p-1" />
    </div>
</template>
