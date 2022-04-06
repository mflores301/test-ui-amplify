<script setup lang="ts">
defineProps<{
  color?: 'primary' | 'secondary' | 'tertiary'
}>()
</script>

<template>
  <div
    class="label" :class="{
      'bg-gray-300 text-gray-800': !color,
      'bg-[#48559C] text-white': color === 'primary',
      'bg-primary text-black text-opacity-80 bg-opacity-30': color === 'tertiary'
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
    .label {
        @apply inline-flex items-center justify-center h-5 px-3 rounded-full text-xs font-medium leading-none tracking-normal;
    }
</style>
