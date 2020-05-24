<template>
  <div id="app" class="flex flex-col text-gray-900 min-h-screen">
      <div style="position: fixed; z-index: -99; width: 100%; height: 100%" v-if="glorymode">
          <iframe frameborder="0" height="100%" width="100%"
                  src="https://youtube.com/embed/YgGzAKP_HuM?autoplay=1&controls=0&autohide=1&fs=0&iv_load_policy=3&loop=1&playlist=YgGzAKP_HuM&modestbranding=1">
          </iframe>
      </div>

      <div class="flex items-start flex-wrap flex-grow flex-col sm:flex-row" :class="(glorymode ? 'justify-start' : 'justify-center')">
          <FeederTraderoutes></FeederTraderoutes>
          <NPCCalc></NPCCalc>
          <CropScouter></CropScouter>
      </div>

      <div class="w-full flex justify-center items-center border-t p-4 bg-white">
          <button class="bg-red-700 text-white px-2 rounded mx-2 pb-1" @click="toggleGloryMode">Glory mode</button>
          <div>Made by <a href="https://www.frisovandijk.com" target="_blank" class="underline">Friso van Dijk</a></div>
      </div>
  </div>
</template>

<script>
import FeederTraderoutes from './components/FeederTraderoutes.vue'
import NPCCalc from './components/NPCCalc.vue'
import CropScouter from './components/CropScouter.vue'

export default {
    name: 'app',
    components: {
        FeederTraderoutes,
        NPCCalc,
        CropScouter
    },
    data() {
        return {
            glorymode: false
        }
    },
    methods: {
        toggleGloryMode() {
            this.glorymode = !this.glorymode
        }
    }
}
</script>
