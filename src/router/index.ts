import { createRouter, createWebHistory } from 'vue-router'

import { categories as nwsZoneCategories } from 'virtual:nws-zones'

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
      path: '/:category(' + nwsZoneCategories.join('|') + ')/:path',
      name: 'alerts',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AlertsView,
    },
    {
      path: '/:category(' + nwsZoneCategories.join('|') + ')',
      name: 'categories',
      component: CategoriesView,
    },
  ],
})

export default router
