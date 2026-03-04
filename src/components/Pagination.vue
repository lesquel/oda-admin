<script setup lang="ts">
const props = defineProps<{ page: number; total: number; limit: number }>()
const emit = defineEmits<{ (e: 'change', page: number): void }>()

const totalPages = () => Math.ceil(props.total / props.limit)
</script>

<template>
  <div class="flex items-center gap-2 mt-4">
    <button
      :disabled="page <= 1"
      @click="emit('change', page - 1)"
      class="px-3 py-1 rounded bg-gray-200 disabled:opacity-40 hover:bg-gray-300"
    >
      ←
    </button>
    <span class="text-sm text-gray-600">
      Page {{ page }} of {{ totalPages() }} ({{ total }} total)
    </span>
    <button
      :disabled="page >= totalPages()"
      @click="emit('change', page + 1)"
      class="px-3 py-1 rounded bg-gray-200 disabled:opacity-40 hover:bg-gray-300"
    >
      →
    </button>
  </div>
</template>
