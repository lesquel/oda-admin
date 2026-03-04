<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi, type DashboardStats } from '@/api/admin'

const stats   = ref<DashboardStats | null>(null)
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    stats.value = await adminApi.dashboard()
  } catch {
    error.value = 'Failed to load dashboard stats'
  } finally {
    loading.value = false
  }
})

const cards = [
  { key: 'total_users',     label: 'Users',     icon: '👥', color: 'bg-blue-500' },
  { key: 'total_poems',     label: 'Poems',     icon: '📝', color: 'bg-purple-500' },
  { key: 'total_likes',     label: 'Likes',     icon: '❤️', color: 'bg-pink-500' },
  { key: 'total_bookmarks', label: 'Bookmarks', icon: '🔖', color: 'bg-yellow-500' },
  { key: 'total_emotions',  label: 'Emotions',  icon: '💜', color: 'bg-indigo-500' },
]
</script>

<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div
        v-for="card in cards"
        :key="card.key"
        class="rounded-xl p-5 text-white shadow-md"
        :class="card.color"
      >
        <div class="text-3xl mb-1">{{ card.icon }}</div>
        <div class="text-3xl font-bold">{{ stats?.[card.key as keyof DashboardStats] ?? 0 }}</div>
        <div class="text-sm opacity-80 mt-1">{{ card.label }}</div>
      </div>
    </div>
  </div>
</template>
