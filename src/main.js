// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import cookies from 'vue-cookies'
import {$axios} from './assets/js/interceptors'
import store from '@/store/index'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/public.css'
import './assets/css/icon/iconfont.css'

Vue.use(elementUI)
Vue.prototype.$http = $axios
Vue.prototype.$cookies = cookies
Vue.config.productionTip = false

// 登录检测
router.beforeEach((to, from, next) => {
  let t = cookies.get('t')
  if (to.name !== 'login') {
    if (t) {
      next()
    } else {
      element.Message({
        message: '用户未登录',
        type: 'info'
      })
      next({path: '/login'})
      // next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
