import { createRouter, createWebHistory } from 'vue-router'

import { categories } from 'virtual:nws-zones'

import HomeView from '../views/HomeView.vue'
import AlertsView from '../views/AlertsView.vue'
import CategoriesView from '../views/CategoriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:category(' + categories.join('|') + ')/:path',
      name: 'alerts',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AlertsView,
    },
    {
      path: '/:category(' + categories.join('|') + ')',
      name: 'categories',
      component: CategoriesView,
    },
  ],
})

export default router
