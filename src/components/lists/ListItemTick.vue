
<script setup lang="ts">
defineProps<{
  checked?: boolean
}>()

defineEmits(['click'])
</script>

<template>
  <button
    class="flex items-center h-9 rounded-md p-2 w-full "
    :class="checked ? 'bg-primary-light text-white' : 'hover:bg-primary-light-hover hover:text-gray-800'"
    @click="$emit('click')"
  >
    <i-ph-check class="w-5 h-5 mr-2" :class="checked ? 'opacity-100' : 'opacity-0'" />
    <div class="text-xs leading-none whitespace-nowrap">
      <slot />
    </div>
  </button>
</template>
