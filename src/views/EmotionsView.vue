<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { adminApi, type AdminEmotion } from '@/api/admin'
import Pagination from '@/components/Pagination.vue'

const items   = ref<AdminEmotion[]>([])
const total   = ref(0)
const page    = ref(1)
const limit   = 20
const loading = ref(true)
const error   = ref('')

async function load() {
  loading.value = true
  error.value   = ''
  try {
    const res   = await adminApi.listEmotions(page.value, limit)
    items.value = res.data
    total.value = res.total
  } catch {
    error.value = 'Failed to load emotions'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(page, load)
</script>

<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Emotions (Tags)</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else>
      <div class="overflow-x-auto rounded-xl shadow">
        <table class="min-w-full bg-white text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Poem ID</th>
              <th class="px-4 py-3 text-left">User ID</th>
              <th class="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-600">{{ item.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ item.poem_id }}</td>
              <td class="px-4 py-3 text-gray-600">{{ item.user_id }}</td>
              <td class="px-4 py-3 text-gray-600">{{ item.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :page="page" :total="total" :limit="limit" @change="p => page = p" />
    </div>
  </div>
</template>
