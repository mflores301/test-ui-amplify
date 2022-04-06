<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits(['clear', 'close'])
</script>

<template>
  <div class="w-full min-w-54">
    <header class="flex justify-between items-center py-3 px-4">
      {{ title }}

      <button class="rounded-full text-gray-600 p-1" @click="$emit('close')">
        <i-ph-x-bold class="w-4 h-4" />
      </button>
    </header>

    <div class="">
      <slot />
    </div>

    <footer class="py-3 px-4 flex justify-end border-t">
      <button class="text-gray-600 text-sm px-2" @click="$emit('clear')">
        Clear
      </button>
    </footer>
  </div>
</template>
