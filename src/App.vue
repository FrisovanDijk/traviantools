<script setup>
    import TheNavbar from '@/components/TheNavbar.vue'
    import Calculators from '@/components/Calculators.vue'
    import { ref, watch, onBeforeMount } from 'vue'

    const data = ref({
        tabs: [
            {
                name: 'Home',
                calculators: []
            }
        ],
        currentTab: 0
    })

    const storeLocal = () => {
        localStorage.setItem("data", JSON.stringify(data.value.tabs))
    }

    onBeforeMount(() => {
        if(localStorage.getItem('data')) {
            data.value.tabs = JSON.parse(localStorage.getItem('data'))
        }
    })

    watch(data.value, () => {
        localStorage.setItem("data", JSON.stringify(data.value.tabs))
    }, {
        deep: true
    })

    // Tabs
    const switchTab = (i) => {
        data.value.currentTab = i
    }

    let newTabName = ref('')
    const addTab = (name) => {
        const newTab = {
            name: name,
            calculators: []
        }
        data.value.tabs.push(newTab)
        newTabName.value = ''
    }

    const clearTabs = () => {
        data.value.tabs = [{
            name: 'Tab 1',
            calculators: []
        }]
    }
</script>

<template>
    <header>
        <TheNavbar />
    </header>

    <div class="w-full flex">
        <!-- Sidebar -->
        <div class="w-48 p-4">
            <ul>
                <li v-for="(tab, index) in data.tabs"
                    class="py-1 my-2 hover:bg-green-100 px-2 rounded cursor-pointer"
                    :class="[
                index === data.currentTab ? 'underline bg-green-200' : 'bg-slate-200'
            ]"
                    @click="switchTab(index)"
                >{{ tab.name }}
                </li>
            </ul>

            <div class="flex mt-6">
                <form @submit.prevent="addTab(newTabName)">
                    <input type="text" id="name" class="w-full border-slate-400 border-2 rounded py-0.5 px-1" v-model="newTabName">
                    <button type="submit" class="py-1 px-3 bg-emerald-600 mt-2 rounded font-semibold text-white text-sm">Add tab</button>
                </form>
            </div>

            <div class="flex mt-6">
                <button @click="clearTabs" class="py-1 px-3 bg-rose-600 mt-2 rounded font-semibold text-white text-sm">Clear all tabs</button>
            </div>
        </div>
        <div class="flex-1 p-6">
            <Calculators :calculators="data.tabs[data.currentTab].calculators" />
        </div>
    </div>
</template>
