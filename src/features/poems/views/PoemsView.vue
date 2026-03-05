<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { poemsApi } from '../services/poems-api'
import type { AdminPoem } from '../domain/types'
import Pagination from '@/core/components/Pagination.vue'

const poems = ref<AdminPoem[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await poemsApi.list(page.value, limit)
    poems.value = res.data
    total.value = res.total
  } catch {
    error.value = 'Failed to load poems'
  } finally {
    loading.value = false
  }
}

async function deletePoem(poem: AdminPoem) {
  if (!confirm(`Delete poem "${poem.title}"?`)) return
  try {
    await poemsApi.remove(poem.id)
    await load()
  } catch {
    alert('Failed to delete poem')
  }
}

onMounted(load)
watch(page, load)
</script>

<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Poems</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else>
      <div class="overflow-x-auto rounded-xl shadow">
        <table class="min-w-full bg-white text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">Title</th>
              <th class="px-4 py-3 text-left">Author</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Created</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="p in poems" :key="p.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ p.title }}</td>
              <td class="px-4 py-3 text-gray-500">{{ p.author_username }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    p.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  {{ p.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-400">
                {{ new Date(p.created_at).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3">
                <button
                  @click="deletePoem(p)"
                  class="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :page="page" :total="total" :limit="limit" @change="(p) => (page = p)" />
    </div>
  </div>
</template>
