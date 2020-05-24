<template>
    <div class="flex items-center align-center">
        <img :src="'img/' + type + '.png'" class="p-1">
    </div>
</template>

<script>
    export default {
        name: 'ResImg',
        props: {
            type: String
        }
    }
</script>