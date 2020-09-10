<template>
    <div class="my-4 sm:mx-4 border border-gray-500 rounded shadow-md flex flex-col bg-white" style="width: 310px">
        <h1 class="text-lg font-semibold bg-green-600 text-gray-100 p-2">{{ title }}</h1>

        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'CardContainer',
        props: {
            title: String
        }
    }
</script>
