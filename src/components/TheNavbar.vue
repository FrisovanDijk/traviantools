<script setup>
    import { useI18n } from 'vue-i18n'
    const i18n = useI18n()

    const updateStorageLocale = () => {
        console.log(i18n.locale.value)
        localStorage.setItem("locale", i18n.locale.value)
    }
</script>

<template>
    <div class="w-full flex text-white p-3 justify-between" style="background: rgb(5,150,105);
background: linear-gradient(111deg, rgba(5,150,105,1) 33%, rgba(217,119,6,1) 33%, rgba(217,119,6,1) 70%, rgba(71,85,105,1) 70%);">
        <div>
            <span class="font-semibold">{{$t('site_title')}}</span><span class="text-sm hidden sm:inline-block pl-4 text-gray-200">
            {{$t('site_title_byline')}}
            </span>
        </div>
        <slot></slot>
        <div class="justify-self-end text-gray-950">
            <select v-model="$i18n.locale" class=" px-1 pb-0.5 rounded" @change="updateStorageLocale()">
                <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
            </select>
        </div>
    </div>
</template>
