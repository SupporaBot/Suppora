import { createRouter, createWebHistory } from 'vue-router'
import Homepage from './homepage/Homepage.vue'
import NotFound from './notFound.vue'
import Test from './test.vue'
import Account from './account/Account.vue'
import Dashboard from './dashboard/Dashboard.vue'
import Privacy from './Privacy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Homepage',
      path: '/',
      component: Homepage
    },

    {
      name: 'Dashboard',
      path: '/dashboard',
      alias: ['/bot-dashboard'],
      component: Dashboard
    },

    {
      name: 'Account',
      path: '/account',
      alias: ['/sign-in', '/log-in', '/profile'],
      component: Account
    },


    // Information:
    {
      name: 'Privacy Policy',
      path: '/privacy',
      alias: ['/privacy-policy'],
      component: Privacy
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
  scrollBehavior: (to, from, savedPos) => {
    // Back/forward navigation
    if (savedPos) {
      return {
        ...savedPos,
        behavior: 'smooth'
      }
    }
    // Anchor links (#section)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Default scroll to top
    return {
      top: 0,
      left: 0,
      behavior: 'smooth'
    }
  }
})


router.afterEach((to, from, fail) => {
  if (to) {
    window.document.title = `Suppora - ${String(to?.name)}`
  }
})

export default router
