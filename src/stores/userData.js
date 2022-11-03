import { reactive } from "vue"

export const userData = reactive({
    tabs: [{
        name: 'Tab 1',
        calculators: []
    }],
    currentTab: 0
})
