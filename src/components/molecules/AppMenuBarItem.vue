<template>
    <li @click="$emit('clicked')"
        class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800"
    >
        {{ name }}
    </li>
</template>

<script>
    export default {
        props: {
            name: String
        }
    }
</script>
