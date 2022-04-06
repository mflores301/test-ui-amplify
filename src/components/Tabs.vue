<script setup lang="ts">
interface Tab {
  label: string
  value: string
}
defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

defineEmits(['update:modelValue'])

</script>

<template>
  <div class="flex w-full border-b border-gray-300">
    <ul class="flex space-x-6" role="tablist">
      <li v-for="tab in tabs" :key="tab.value" :class="tab.value === modelValue ? 'active' : ''" class="group relative flex-1 w-max text-xs text-gray-500" role="presentation">
        <button class="group transition-colors py-2 leading-none text-center w-max rounded-t-md" role="tab" @click="$emit('update:modelValue', tab.value)">
          {{ tab.label }}
        </button>
        <div class="indicator absolute transition w-full h-2px rounded-t-sm bg-gray-300 -mt-2px opacity-0 group-hover:opacity-100" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.active button {
    @apply text-primary font-medium;
}
.active .indicator {
    @apply opacity-100 bg-primary;
}
</style>
