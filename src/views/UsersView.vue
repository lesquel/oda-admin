<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { adminApi, type AdminUser } from '@/api/admin'
import Pagination from '@/components/Pagination.vue'

const users   = ref<AdminUser[]>([])
const total   = ref(0)
const page    = ref(1)
const limit   = 20
const loading = ref(true)
const error   = ref('')

async function load() {
  loading.value = true
  error.value   = ''
  try {
    const res   = await adminApi.listUsers(page.value, limit)
    users.value = res.data
    total.value = res.total
  } catch {
    error.value = 'Failed to load users'
  } finally {
    loading.value = false
  }
}

async function toggleBan(user: AdminUser) {
  try {
    await adminApi.toggleUserBan(user.id, !user.is_active)
    await load()
  } catch {
    alert('Failed to update user')
  }
}

async function deleteUser(user: AdminUser) {
  if (!confirm(`Delete user ${user.username}?`)) return
  try {
    await adminApi.deleteUser(user.id)
    await load()
  } catch {
    alert('Failed to delete user')
  }
}

onMounted(load)
watch(page, load)
</script>

<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Users</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else>
      <div class="overflow-x-auto rounded-xl shadow">
        <table class="min-w-full bg-white text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">Username</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Created</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ u.username }}</td>
              <td class="px-4 py-3 text-gray-500">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ u.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
                >
                  {{ u.is_active ? 'Active' : 'Banned' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-400">{{ new Date(u.created_at).toLocaleDateString() }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="toggleBan(u)"
                  class="text-xs px-2 py-1 rounded"
                  :class="u.is_active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'"
                >
                  {{ u.is_active ? 'Ban' : 'Unban' }}
                </button>
                <button
                  @click="deleteUser(u)"
                  class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :page="page" :total="total" :limit="limit" @change="p => page = p" />
    </div>
  </div>
</template>
