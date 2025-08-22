<script setup>
    import CalculatorWrapper from "@/components/CalculatorWrapper.vue"
    import { userData } from '@/stores/userData.js'

    const props = defineProps({
        index: {
            type: Number,
            default: -1
        }
    })

    const close = () => {
        userData.tabs[userData.currentTab].calculators.splice(props.index, 1)
    }
</script>

<template>
    <CalculatorWrapper :title="$t('menu.help')" @close:calculator="close" :close="index >= 0">
        <div class="px-4 pt-1 pb-3 text-sm flex flex-col space-y-3">
            <p><span class="font-semibold">{{$t('help.version')}}</span> {{$t('help.version_new')}}</p>
            <p class="whitespace-pre-wrap">{{$t('help.help')}}</p>
            <p class="font-semibold">{{$t('help.issues')}}</p>
            <p class="whitespace-pre-wrap">{{$t('help.issues_text')}}</p>
        </div>
    </CalculatorWrapper>
</template>
