<script setup lang="ts">
defineProps<{
  checked?: boolean
}>()

defineEmits(['click'])
</script>
<template>
  <button
    class="flex relative items-center h-9 rounded-md p-2 pr-4 w-full hover:bg-primary-light-hover hover:text-gray-800"
    @click="$emit('click')"
  >
    <input
      type="checkbox"
      class="sibling mr-3 appearance-none border pointer-events-none w-4 h-4 focus:ring checked:bg-secondary checked:opacity-10 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      :checked="checked"
      aria-label="checkbox"
    >
    <i-ph-check class="w-5 h-5 mr-2 absolute text-secondary" :class="checked ? '' : 'opacity-0'" />
    <div
      class="text-xs leading-none whitespace-nowrap w-content"
    >
      <slot />
    </div>
  </button>
</template>
