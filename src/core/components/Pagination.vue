<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ page?: number; total?: number; limit?: number }>(), {
  page: 1,
  total: 0,
  limit: 20,
})
const emit = defineEmits<{ (e: 'change', page: number): void }>()

const safeTotal = computed(() => (Number.isFinite(props.total) ? props.total : 0))
const safeLimit = computed(() => (Number.isFinite(props.limit) && props.limit > 0 ? props.limit : 20))
const safePage = computed(() => (Number.isFinite(props.page) && props.page > 0 ? props.page : 1))
const totalPages = computed(() => Math.max(1, Math.ceil(safeTotal.value / safeLimit.value)))
</script>

<template>
  <div class="flex items-center gap-2 mt-4">
    <button
      :disabled="safePage <= 1"
      @click="emit('change', safePage - 1)"
      class="px-3 py-1 rounded bg-gray-200 disabled:opacity-40 hover:bg-gray-300"
    >
      ←
    </button>
    <span class="text-sm text-gray-600">
      Page {{ safePage }} of {{ totalPages }} ({{ safeTotal }} total)
    </span>
    <button
      :disabled="safePage >= totalPages"
      @click="emit('change', safePage + 1)"
      class="px-3 py-1 rounded bg-gray-200 disabled:opacity-40 hover:bg-gray-300"
    >
      →
    </button>
  </div>
</template>
