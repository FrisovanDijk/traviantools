<script setup>

</script>

<template>
    <div class="w-full flex text-white p-3 flex" style="background: rgb(5,150,105);
background: linear-gradient(111deg, rgba(5,150,105,1) 33%, rgba(217,119,6,1) 33%, rgba(217,119,6,1) 70%, rgba(71,85,105,1) 70%);">
        <div><span class="font-semibold">{{$t('site_title')}}</span><span class="text-sm hidden sm:inline-block pl-4 text-gray-200">
            {{$t('site_title_byline')}}
        </span></div>
        <slot></slot>
    </div>
</template>
