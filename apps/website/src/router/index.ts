import { createRouter, createWebHistory } from 'vue-router'
import Homepage from './homepage/Homepage.vue'
import NotFound from './notFound.vue'
import Test from './test.vue'
import Account from './account/Account.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Homepage',
      path: '/',
      component: Homepage
    },



    {
      name: 'Account',
      path: '/account',
      alias: ['/sign-in', '/log-in', '/profile'],
      component: Account
    },



    {
      name: 'Testing',
      path: '/test',
      alias: ['/t', '/tests'],
      component: Test,
      beforeEnter: () => {
        if (import.meta.env.PROD) router.push('/')
      }
    },


    {
      name: 'Not Found',
      path: '/:pathMatch(.*)*',
      component: NotFound
    }
  ],
})


router.afterEach((to, from, fail) => {
  if (to) {
    window.document.title = `Suppora - ${String(to?.name)}`
  }
})

export default router
