<template>
  <div id="app" class="flex flex-col text-gray-900 min-h-screen">
      <div style="position: fixed; z-index: -99; width: 100%; height: 100%" v-if="glorymode">
          <iframe frameborder="0" height="100%" width="100%"
                  src="https://youtube.com/embed/YgGzAKP_HuM?autoplay=1&controls=0&autohide=1&fs=0&iv_load_policy=3&loop=1&playlist=YgGzAKP_HuM&modestbranding=1">
          </iframe>
      </div>

      <BackgroundImage v-if="!glorymode"></BackgroundImage>

      <div class="flex flex-col flex-grow">

          <AppMenuBar @add="addComponent"
                      @reset="components = []"
          ></AppMenuBar>

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
                  <CPNextVillage     class="list-item" :key="component.id" @close:view="closeComponent(component)" v-if="component.name === 'CPNextVillage'"></CPNextVillage>
              </template>
              <div v-if="components.length < 1"
                   :key="-1"
                   class="bg-white p-4 mt-4 mx-2 list-item border"
              >
                  Use the menu to open calculators. You can open multiple of the same type.
              </div>
          </transition-group>
      </div>

      <AppFooter @glorymode="toggleGloryMode"></AppFooter>
  </div>
</template>

<script>
import FeederTraderoutes from './components/FeederTraderoutes.vue'
import TotalResources from './components/TotalResources.vue'
import CropScouter from './components/CropScouter.vue'
import MerchantCalc from './components/MerchantCalc.vue'
import NPCCalculator from "./components/NPCCalculator";
import CPNextVillage from "./components/CPNextVillage";

import BackgroundImage from "./components/AppBackgroundImage";
import AppFooter from "./components/molecules/AppFooter";
import AppMenuBar from "./components/molecules/AppMenuBar";

export default {
    name: 'app',
    components: {
        FeederTraderoutes,
        TotalResources,
        CropScouter,
        MerchantCalc,
        NPCCalculator,
        CPNextVillage,
        BackgroundImage,
        AppFooter,
        AppMenuBar
    },
    data() {
        return {
            glorymode: false,
            components: [],
            componentId: 0
        }
    },
    created() {
        this.addComponent('NPCCalculator')
        this.addComponent('FeederTraderoutes')
        this.addComponent('CPNextVillage')
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
