<template>
  <div id="app" class="flex flex-col text-gray-900 min-h-screen">
      <div style="position: fixed; z-index: -99; width: 100%; height: 100%" v-if="glorymode">
          <iframe frameborder="0" height="100%" width="100%"
                  src="https://youtube.com/embed/YgGzAKP_HuM?autoplay=1&controls=0&autohide=1&fs=0&iv_load_policy=3&loop=1&playlist=YgGzAKP_HuM&modestbranding=1">
          </iframe>
      </div>

      <div class="flex flex-col flex-grow">
          <ul class="max-w-full mx-auto mt-4 rounded border border-gray-500 text-white font-semibold uppercase text-sm flex flex-wrap justify-between">
              <li @click="addComponent('NPCCalculator')"     class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800">Building cost</li>
              <li @click="addComponent('FeederTraderoutes')" class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800">Feeder traderoute</li>
              <li @click="addComponent('MerchantCalc')"      class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800">Merchant trips</li>
              <li @click="addComponent('CropScouter')"       class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800">Cropscout</li>
              <li @click="addComponent('TotalResources')"    class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800">Total resources</li>
              <li @click="components = []"                          class="w-1/2 text-center border border-gray-500 bg-orange-900 flex items-center justify-center lg:w-auto cursor-pointer py-2 px-4 hover:bg-orange-800">Clear all</li>
          </ul>
          <transition-group name="list"
                            tag="div"
                            class="flex sm:justify-center flex-wrap flex-grow flex-col sm:flex-row"
                            :class="(glorymode ? 'items-end' : 'items-center sm:items-start')"
          >
              <template v-for="(component) in components">
                  <NPCCalculator     class="list-item" :key="component.id" @close:view="closeComponent(component)" v-if="component.name === 'NPCCalculator'"></NPCCalculator>
                  <FeederTraderoutes class="list-item" :key="component.id" @close:view="closeComponent(component)" v-if="component.name === 'FeederTraderoutes'"></FeederTraderoutes>
                  <MerchantCalc      class="list-item" :key="component.id" @close:view="closeComponent(component)" v-if="component.name === 'MerchantCalc'"></MerchantCalc>
                  <CropScouter       class="list-item" :key="component.id" @close:view="closeComponent(component)" v-if="component.name === 'CropScouter'"></CropScouter>
                  <TotalResources    class="list-item" :key="component.id" @close:view="closeComponent(component)" v-if="component.name === 'TotalResources'"></TotalResources>
              </template>
              <div v-if="components.length < 1"
                   :key="-1"
                   class="bg-white p-4 mt-4 mx-2"
              >
                  Use the menu to open calculators. You can open multiple of the same type.
              </div>
          </transition-group>
      </div>

      <div class="w-full flex justify-center items-center border-t p-2 bg-white text-sm">
          <button class="bg-red-700 hover:bg-red-500 text-white px-2 rounded mx-4 py-1" @click="toggleGloryMode">Glory mode</button>
          <div class="mx-2 max-w-lg">
              Handy calculators for the browser game <a href="https://www.travian.com" target="_blank" class="underline">Travian</a>,
              free and open source on <a href="https://github.com/FrisovanDijk/traviantools" target="_blank" class="underline">GitHub</a>.
              Made by <a href="https://www.frisovandijk.com" target="_blank" class="underline">Friso van Dijk</a>.
              Imagery of <a href="https://www.traviangames.com" target="_blank" class="underline">Travian Games GmbH</a>.
          </div>
      </div>
  </div>
</template>

<script>
import FeederTraderoutes from './components/FeederTraderoutes.vue'
import TotalResources from './components/TotalResources.vue'
import CropScouter from './components/CropScouter.vue'
import MerchantCalc from './components/MerchantCalc.vue'
import NPCCalculator from "./components/NPCCalculator";

export default {
    name: 'app',
    components: {
        FeederTraderoutes,
        TotalResources,
        CropScouter,
        MerchantCalc,
        NPCCalculator
    },
    data() {
        return {
            glorymode: false,
            components: [],
            componentId: 0
        }
    },
    methods: {
        toggleGloryMode() {
            this.glorymode = !this.glorymode
        },
        addComponent(name) {
            this.components.push({
                name: name,
                id: this.componentId++
            })
        },
        closeComponent(item) {
            this.components.splice(this.components.indexOf(item), 1)
        }
    }
}
</script>

<style>
    list-item {
        display: inline-block;
        margin-right: 10px;
    }
    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }
    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
    }
</style>
