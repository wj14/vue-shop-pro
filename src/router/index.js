import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'

Vue.use(Router)

var router = new Router({
  routes: [{
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }]
  }, {
    path: '/',
    redirect: '/login'
  }]
})

router.beforeEach((to, from, next) => {
  // 访问/login直接放行
  if (to.path === '/login') {
    return next()
  }
  // 访问非login路由，判断token
  var token = sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
