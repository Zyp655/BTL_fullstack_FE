import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import router from './router'
import './style.css'
import vuetify from './plugins/vuetify'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Antd)

app.mount('#app')

