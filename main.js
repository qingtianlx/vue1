// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import moment from 'moment'
// import axios from 'axios'
import myaxios from '@/assets/js/myaxios.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import mybread from '@/components/bread.vue'

import quillEditor from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(myaxios)
Vue.use(Element)
Vue.use(quillEditor)
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 注册全局面包屑导航组件
Vue.component(mybread.name, mybread)

// Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.filter('dataformat', function (value) {
  return moment(value).format('YYYY-MM-DD hh:mm:ss')
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
