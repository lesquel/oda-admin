<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi, type EmotionCatalogItem } from '@/api/admin'

const items   = ref<EmotionCatalogItem[]>([])
const loading = ref(true)
const error   = ref('')
const showForm = ref(false)
const form = ref({ name: '', emoji: '', description: '' })
const saving = ref(false)

async function load() {
  loading.value = true
  try {
    items.value = await adminApi.listEmotionCatalog()
  } catch {
    error.value = 'Failed to load emotion catalog'
  } finally {
    loading.value = false
  }
}

async function create() {
  saving.value = true
  try {
    await adminApi.createEmotion(form.value)
    form.value = { name: '', emoji: '', description: '' }
    showForm.value = false
    await load()
  } catch {
    alert('Failed to create emotion')
  } finally {
    saving.value = false
  }
}

async function remove(item: EmotionCatalogItem) {
  if (!confirm(`Delete emotion "${item.name}"?`)) return
  try {
    await adminApi.deleteEmotionCatalog(item.id)
    await load()
  } catch {
    alert('Failed to delete emotion')
  }
}

onMounted(load)
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Emotion Catalog</h2>
      <button
        @click="showForm = !showForm"
        class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
      >
        + Add Emotion
      </button>
    </div>

    <!-- Create form -->
    <div v-if="showForm" class="bg-white rounded-xl shadow p-5 mb-6 max-w-md">
      <h3 class="font-semibold mb-4 text-gray-700">New Emotion</h3>
      <div class="space-y-3">
        <input
          v-model="form.name"
          placeholder="Name (e.g. joy)"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          v-model="form.emoji"
          placeholder="Emoji (e.g. 😊)"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          v-model="form.description"
          placeholder="Description"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <div class="flex gap-2">
          <button
            @click="create"
            :disabled="saving || !form.name"
            class="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
          >
            {{ saving ? 'Saving...' : 'Create' }}
          </button>
          <button
            @click="showForm = false"
            class="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-white rounded-xl shadow p-4 flex items-center gap-3 group"
      >
        <span class="text-2xl">{{ item.emoji }}</span>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-800 capitalize">{{ item.name }}</p>
          <p class="text-xs text-gray-400 truncate">{{ item.description }}</p>
        </div>
        <button
          @click="remove(item)"
          class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
