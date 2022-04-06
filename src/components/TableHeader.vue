<script setup lang="ts">
defineProps<{
  center?: boolean
  sort?: 'down' | 'up'
}>()
</script>

<template>
  <div class="text-xs text-cool-gray-800 whitespace-nowrap" :class="{ 'justify-center': center }">
    <button class="flex py-2 items-center">
      <slot />
      <div class="px-2">
        <IconSort v-bind="{ sort }" class="h-3" />
      </div>
    </button>
  </div>
</template>
