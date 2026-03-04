import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/components/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/UsersView.vue'),
        },
        {
          path: 'poems',
          name: 'poems',
          component: () => import('@/views/PoemsView.vue'),
        },
        {
          path: 'emotions',
          name: 'emotions',
          component: () => import('@/views/EmotionsView.vue'),
        },
        {
          path: 'emotion-catalog',
          name: 'emotion-catalog',
          component: () => import('@/views/EmotionCatalogView.vue'),
        },
        {
          path: 'likes',
          name: 'likes',
          component: () => import('@/views/LikesView.vue'),
        },
        {
          path: 'bookmarks',
          name: 'bookmarks',
          component: () => import('@/views/BookmarksView.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false
  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
