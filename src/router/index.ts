import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth-store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/auth/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layout/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/features/dashboard/views/DashboardView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/features/users/views/UsersView.vue'),
        },
        {
          path: 'poems',
          name: 'poems',
          component: () => import('@/features/poems/views/PoemsView.vue'),
        },
        {
          path: 'emotions',
          name: 'emotions',
          component: () => import('@/features/emotions/views/EmotionsView.vue'),
        },
        {
          path: 'emotion-catalog',
          name: 'emotion-catalog',
          component: () => import('@/features/emotion-catalog/views/EmotionCatalogView.vue'),
        },
        {
          path: 'likes',
          name: 'likes',
          component: () => import('@/features/likes/views/LikesView.vue'),
        },
        {
          path: 'bookmarks',
          name: 'bookmarks',
          component: () => import('@/features/bookmarks/views/BookmarksView.vue'),
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
