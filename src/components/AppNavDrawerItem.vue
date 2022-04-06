<script setup lang="ts">
defineProps<{
  exact?: boolean
  to: string
}>()
</script>

<template>
  <RouterLink
    v-slot="{ isActive }"
    v-bind="{ exact, to }"
    active-class="text-white font-semibold bg-primary-light hover:bg-primary-light"
    class="transition-colors inline-flex space-x-3 items-center justify-start w-full py-3 pl-3 pr-4 rounded-lg hover:bg-primary-hover"
  >
    <div class="w-6 h-full">
      <slot name="icon" v-bind="{ isActive }" />
    </div>
    <span
      class="text-xs tracking-wide truncate"
    >
      <slot />
    </span>
  </RouterLink>
</template>
