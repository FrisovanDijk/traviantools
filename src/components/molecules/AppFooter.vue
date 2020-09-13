<template>
    <div class="w-full flex justify-center items-center border-t p-2 bg-white text-sm">
        <button class="bg-red-700 hover:bg-red-500 text-white px-2 rounded mx-4 py-1" @click="$emit('glorymode')">Glory mode</button>
        <div class="mx-2 max-w-lg">
            Handy calculators for the browser game <a href="https://www.travian.com" target="_blank" class="underline">Travian</a>,
            free and open source on <a href="https://github.com/FrisovanDijk/traviantools" target="_blank" class="underline">GitHub</a>.
            Made by <a href="https://www.frisovandijk.com" target="_blank" class="underline">Friso van Dijk</a>.
            Background image from <a href="https://www.unsplash.com" target="_blank" class="underline">Unsplash</a>.
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppFooter'
    }
</script>
