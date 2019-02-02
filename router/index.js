import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/users.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
import goods from '@/components/goods.vue'
import addgoods from '@/components/addgoods.vue'
import { Message } from 'element-ui'
Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/users',
          component: users
        },
        {
          path: '/rights',
          component: rights
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/goods',
          component: goods
        },
        { path: '/goods/addgoods', component: addgoods }
      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    var token = window.localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      Message.error('您还没有登录哦~~~')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
