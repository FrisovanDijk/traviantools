<script setup>
    import TheNavbar from '@/components/TheNavbar.vue'
    import Calculators from '@/components/Calculators.vue'
    import CalculatorsMenu from '@/components/CalculatorsMenu.vue'
    import { ref, watch, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    // Load from local storage
    onBeforeMount(() => {
        if(localStorage.getItem('data')) {
            userData.tabs = JSON.parse(localStorage.getItem('data'))
            // localStorage.removeItem('data')
        }
    })

    // Watch for changes to save to local storage
    watch(userData, () => {
        localStorage.setItem("data", JSON.stringify(userData.tabs))
    }, {
        deep: true
    })

    // Tabs
    const switchTab = (i) => {
        userData.currentTab = i
    }

    let newTabName = ref('')
    const addTab = (name) => {
        if(name.length > 0) {
            userData.tabs.push({
                name: name,
                calculators: []
            })
            newTabName.value = ''
        }
    }

    const clearTabs = () => {
        userData.currentTab = 0
        userData.tabs = [{
            name: 'Tab 1',
            calculators: []
        }]
    }

    const clearTab = () => {
        userData.currentTab = 0
        userData.tabs.splice(userData.currentTab, 1)
        if(userData.tabs.length === 0) {
            userData.tabs = [{
                name: 'Tab 1',
                calculators: []
            }]
        }
    }

    // Calculators
    const addCalculator = (calculator) => {
        userData.tabs[userData.currentTab].calculators.push({
            name: calculator.name,
            calculator: (calculator.calculator ? JSON.parse(JSON.stringify(calculator.calculator)) : false)
        })
    }
</script>

<template>
    <header>
        <TheNavbar />
    </header>

    <div class="w-full flex items-start">
        <!-- Sidebar -->
        <div class="w-48 p-4 hidden sm:block">
            <ul>
                <li v-for="(tab, index) in userData.tabs"
                    class="py-1 my-2 hover:bg-green-100 px-2 rounded cursor-pointer"
                    :class="[
                index === userData.currentTab ? 'underline bg-green-200' : 'bg-slate-200'
            ]"
                    @click="switchTab(index)"
                >{{ tab.name }}
                </li>
            </ul>

            <div class="flex mt-6">
                <form @submit.prevent="addTab(newTabName)">
                    <input type="text" id="name" class="w-full border-slate-400 border-2 rounded py-0.5 px-1" v-model="newTabName">
                    <button type="submit" class="py-1 px-3 bg-emerald-600 hover:bg-emerald-400 mt-2 rounded font-semibold text-white text-sm">Add tab</button>
                </form>
            </div>

            <div class="flex mt-6">
                <button @click="clearTabs" class="py-1 px-3 bg-rose-600 hover:bg-rose-400 mt-2 rounded font-semibold text-white text-sm">Clear all tabs</button>
            </div>
        </div>

        <CalculatorsMenu class="mt-6 ml-2 sm:mr-4"
                         @add:calculator="addCalculator"
                         @clear:tab="clearTab"
        />

        <div class="flex-1 p-2 mt-4">
            <Calculators />
        </div>
    </div>
</template>
