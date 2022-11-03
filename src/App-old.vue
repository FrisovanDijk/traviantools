<script setup>
  import TheNavbar from '@/components/TheNavbar.vue'
  import Calculators from '@/components/Calculators.vue'
  import { ref } from 'vue'

  const tabs = [
          'Tab 1', 'Tab 2', 'Clear tabs'
  ]

  const userData = {

  }

  let currentTab = ref(0)
  const switchTab = (i) => {
    currentTab.value = i
  }
</script>

<template>
  <header>
    <TheNavbar />
  </header>

  <div class="w-full flex">
    <div class="w-48 p-4">
      <ul>
        <li v-for="(tab, index) in tabs"
            class="py-1 my-1 hover:bg-emerald-100 px-2 rounded"
            :class="[
                index === currentTab ? 'underline' : ''
            ]"
            @click="switchTab(index)"
        >{{ tab }}
        </li>
      </ul>
    </div>
    <div class="flex-1 p-6">
      <Calculators :calculators="[]" />
    </div>
  </div>
</template>
