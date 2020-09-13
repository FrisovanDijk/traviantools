<template>
    <div style="position: fixed; z-index: -99; width: 100%; height: 100%" class="bg-green-900">
        <img :src="`https://source.unsplash.com/${width}x${height}/?mountains`"
             alt="background image"
             class="hidden sm:block"
        >
    </div>
</template>

<script>
    export default {
        name: 'BackgroundImage',
        data() {
            return {
                width: window.screen.width,
                height: window.screen.height
            }
        }
    }
</script>
