import ACInput from 'ac-input'
import ACTree from './components/ac-tree.vue'
const plugin = {
  install (Vue, options) {
    Vue.use(ACInput)
    Vue.component('ac-tree', ACTree)
  }
}

export default plugin
