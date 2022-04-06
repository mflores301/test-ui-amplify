<script setup lang="ts">
import Markdown from 'vue3-markdown-it'

defineProps<{
  content?: string
  loading?: boolean
  title: string
}>()
</script>

<template>
  <div class=" bg-gray-100 rounded-lg">
    <div class="p-5">
      <p class="text-xs font-medium leading-none text-gray-800 mb-2">
        {{ title }}
      </p>
      <div class="text-gray-80 prose text-xs">
        <Markdown :source="content" />
      </div>
      <div v-if="loading" class="animate-pulse">
        <div class="mb-1 h-2 bg-slate-200 rounded" />
        <div class="mb-1 h-2 bg-slate-200 rounded" />
        <div class="mb-1 h-2 bg-slate-200 rounded" />
        <div class="mb-1 h-2 bg-slate-200 rounded" />
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>
