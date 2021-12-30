import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: { name: 'Dashboard' },
    childrens: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard.vue'),
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    redirect: { name: 'Sign Up' },
    component: () =>
      import(/* webpackChunkName: 'Auth' */ '../views/Auth/Index.vue'),
    children: [
      {
        name: 'Sign In',
        path: 'signin',
        component: () =>
          import(/* webpackChunkName: 'SignIn' */ '../views/Auth/SignIn.vue'),
      },
      {
        name: 'Sign Up',
        path: 'signup',
        component: () =>
          import(/* webpackChunkName: 'SignUp' */ '../views/Auth/SignUp.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
