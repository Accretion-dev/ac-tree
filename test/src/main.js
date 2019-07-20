import Vue from 'vue'
import App from './App.vue'
import ACTree from '../../index.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import testConfig from '../test-config.json'
import VueSeleniumUnittest from 'vue-selenium-unittest/src/index.js'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(ACTree)
Vue.use(VueSeleniumUnittest, testConfig)

new Vue({
  render: h => h(App),
}).$mount('#app')
