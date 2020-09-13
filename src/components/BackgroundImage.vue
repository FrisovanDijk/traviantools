<template>
    <div style="position: fixed; z-index: -99; width: 100%; height: 100%">
        <img :src="`https://source.unsplash.com/${width}x${height}/?mountains`" alt="background image">
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
