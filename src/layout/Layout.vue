<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth-store'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/poems', label: 'Poems', icon: '📝' },
  { to: '/emotions', label: 'Emotions', icon: '💜' },
  { to: '/emotion-catalog', label: 'Emotion Catalog', icon: '🗂️' },
  { to: '/likes', label: 'Likes', icon: '❤️' },
  { to: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
]
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-purple-900 text-white flex flex-col">
      <div class="px-6 py-5 border-b border-purple-700">
        <h1 class="text-xl font-bold tracking-wide">Oda Admin</h1>
      </div>
      <nav class="flex-1 py-4">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-6 py-3 text-sm hover:bg-purple-800 transition-colors"
          active-class="bg-purple-700 font-semibold"
        >
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </nav>
      <div class="px-6 py-4 border-t border-purple-700">
        <p class="text-xs text-purple-300 mb-2">{{ auth.user?.email }}</p>
        <button
          @click="logout"
          class="w-full text-left text-sm text-purple-200 hover:text-white"
        >
          Sign out →
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
