import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router.js'
import loader from '@/components/loader'
import { createProvider } from './vue-apollo'

// Styles
import './plugins/fontawesome'
import '@/assets/scss/index.scss'

// Else
Vue.config.productionTip = false
Vue.use(require('vue-moment'));
Vue.component('loader', loader);

// Server URL
Vue.prototype.serverURL = 'http://localhost:1337';

// Bus

export const eventBus = new Vue();

// Vue
new Vue({
  store,
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app')

