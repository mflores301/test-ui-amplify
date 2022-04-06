<script setup lang="ts">
defineProps<{
  sort?: 'down' | 'up'
}>()
</script>
<template>
  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 12">
    <path
      :class="sort === 'up' ? 'text-gray-500' : 'text-gray-300'"
      d="m.65 4.188 2.96-3.7a.5.5 0 0 1 .78 0l2.96 3.7A.5.5 0 0 1 6.96 5H1.04a.5.5 0 0 1-.39-.812Z"
      fill="currentColor"
    />
    <path
      :class="sort === 'down' ? 'text-gray-500' : 'text-gray-300'"
      d="m.65 7.812 2.96 3.7c.2.25.58.25.78 0l2.96-3.7A.5.5 0 0 0 6.96 7H1.04a.5.5 0 0 0-.39.812Z"
      fill="currentColor"
    />
  </svg>
</template>
