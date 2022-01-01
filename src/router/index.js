import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        name: 'Landing Page',
        component: () =>
          import(/* webpackChunkName: 'Dashboard' */ '../views/Index.vue'),
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () =>
          import(/* webpackChunkName: 'Profile' */ '../views/Profile.vue'),
        meta: {
          requiresAuth: true,
        },
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
      {
        name: 'Email Verification',
        path: 'email-verification/:token',
        component: () =>
          import(
            /* webpackChunkName: 'EmailVerification' */ '../views/Auth/EmailVerification.vue'
          ),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (localStorage.getItem('access_token')) {
      next()
    } else {
      router.push({ name: 'Sign In' })
    }
  }
  next()
})

export default router
