import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import { languages } from './i18n/index'
const messages = Object.assign(languages)

const i18n = createI18n({
    locale: 'fr',
    fallbackLocale: 'en',
    legacy: false,
    messages
})

const app = createApp(App)

app.use(i18n)

app.mount('#app')
