<script setup>
    import { ref } from 'vue'

    defineProps({
        title: {
            type: String,
            default: 'Title'
        },
        close: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'village'
        },
        noMargin: {
            type: Boolean,
            default: false
        }
    })

    const editable = ref(false)
    const newTitle = ref('')
</script>

<template>
    <div class="relative group border rounded-lg overflow-hidden shadow-md flex flex-col bg-white text-sm calculator" style="width: 310px">

        <div class="bg-rose-800 hover:bg-rose-600 text-white absolute rounded px-2 font-semibold flex items-center justify-center cursor-pointer"
             style="right: 4px; top: 4px; width: 22px; height: 22px;"
             @click="$emit('close:calculator')"
             v-if="close"
        >
            <div style="margin-top: -1px;">X</div>
        </div>
        <div class="flex w-full p-2 items-center gap-2 text-gray-100"
             :class="[
                 type === 'village' ? 'bg-emerald-600' : '',
                 type === 'economy' ? 'bg-amber-600' : '',
                 type === 'troops' ? 'bg-slate-600' : '',
                 type === 'ak' ? 'bg-theme-600 group-hover:bg-theme-500' : '',
                 noMargin ? '' : 'mb-2'
             ]"
        >

            <template v-if="editable">

                <div class="text-sm">{{$t('title')}}:</div>

                <input type="text" v-model="newTitle" class="font-semibold bg-gray-100 border-b border-slate-800 w-40 text-slate-800 px-1">

                <span class="" @click="(newTitle === '' ? true : $emit('new:title', newTitle)); editable = false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>

                <span class="" @click="newTitle = ''; editable = false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>

            </template>

            <template v-else>
                <h1 class="font-semibold text-gray-100" @click="editable = true">{{ title }}</h1>
            </template>

        </div>

        <slot></slot>
    </div>
</template>
