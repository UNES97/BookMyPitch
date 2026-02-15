import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@components/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@views/Dashboard.vue'),
        meta: { title: 'Dashboard', icon: 'HomeIcon' }
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: () => import('@views/Calendar.vue'),
        meta: { title: 'Calendar', icon: 'CalendarIcon' }
      },
      {
        path: 'bookings',
        name: 'bookings',
        component: () => import('@views/Bookings.vue'),
        meta: { title: 'Bookings', icon: 'ClipboardDocumentListIcon' }
      },
      {
        path: 'subscriptions',
        name: 'subscriptions',
        component: () => import('@views/Subscriptions.vue'),
        meta: { title: 'Subscriptions', icon: 'ArrowPathIcon' }
      },
      {
        path: 'fields',
        name: 'fields',
        component: () => import('@views/Fields.vue'),
        meta: { title: 'Fields', icon: 'MapIcon' }
      },
      {
        path: 'customers',
        name: 'customers',
        component: () => import('@views/Customers.vue'),
        meta: { title: 'Customers', icon: 'UsersIcon' }
      },
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@views/Payments.vue'),
        meta: { title: 'Payments', icon: 'CurrencyDollarIcon' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@views/Settings.vue'),
        meta: { title: 'Settings', icon: 'Cog6ToothIcon' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | BookMyPitch` : 'BookMyPitch'
  next()
})

export default router
