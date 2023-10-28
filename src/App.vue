<script setup>
    import TheNavbar from '@/components/TheNavbar.vue'
    import Calculators from '@/components/Calculators.vue'
    import CalculatorsMenu from '@/components/CalculatorsMenu.vue'
    import { ref, watch, onBeforeMount } from 'vue'
    import { userData } from '@/stores/userData.js'

    // Load from local storage
    onBeforeMount(() => {
        if(localStorage.getItem('v3.0')) {
            userData.tabs = JSON.parse(localStorage.getItem('v3.0'))
            // localStorage.removeItem('v3.0')
        }
    })

    // Watch for changes to save to local storage
    watch(userData, () => {
        localStorage.setItem("v3.0", JSON.stringify(userData.tabs))
    }, {
        deep: true
    })

    const showMenu = ref(true)

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
        userData.tabs.splice(userData.currentTab, 1)
        if(userData.tabs.length === 0) {
            userData.tabs = [{
                name: 'Tab 1',
                calculators: []
            }]
        }
        userData.currentTab = 0
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
        <div class="w-48 p-2 hidden lg:block">
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

            <div class="flex mt-4">
                <form @submit.prevent="addTab(newTabName)">
                    <input type="text" id="name" class="w-full border-slate-400 border-2 rounded py-0.5 px-1" v-model="newTabName">
                    <button type="submit" class="py-1 px-3 bg-emerald-600 hover:bg-emerald-400 mt-2 rounded font-semibold text-white text-sm">Add tab</button>
                </form>
            </div>

            <div class="flex mt-4">
                <button @click="clearTabs" class="py-1 px-3 bg-rose-600 hover:bg-rose-400 mt-2 rounded font-semibold text-white text-sm">Clear all tabs</button>
            </div>
        </div>

        <div class="flex flex-col gap-2 mt-4 ml-1 mr-2 sm:mr-1 relative">
            <div class="block sm:hidden rounded p-1 text-center text-white w-full h-8 self-center text-sm cursor-pointer bg-emerald-600 hover:bg-emerald-400"
                 @click="showMenu = !showMenu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" v-if="!showMenu">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-auto" v-else>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
            </div>
            <CalculatorsMenu @add:calculator="addCalculator"
                             @clear:tab="clearTab"
                             :class="[
                             '',
                             showMenu ? 'flex' : 'hidden sm:flex'
                         ]"
            />
        </div>

        <div class="flex-1 p-1 sm:p-2 mt-2">
            <Calculators />
        </div>
    </div>
</template>
