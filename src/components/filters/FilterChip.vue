<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  label: string
}>()

defineEmits(['clear', 'click'])

const isActive = computed(() => !!props.modelValue.length)
const extraCount = computed(() => isActive.value ? props.modelValue.length - 1 : 0)
</script>

<template>
  <button
    class="inline-flex space-x-2 items-center h-full max-h-10 justify-center py-2 px-3 border rounded-full border-gray-200"
    :class="{
      'bg-secondary bg-opacity-20 text-secondary-dark border-transparent': isActive,
      'text-gray-600': !isActive,
    }"
    @click="$emit('click')"
  >
    <span class="text-xs font-medium leading-none">
      {{ isActive ? modelValue[0] : label }}
      <span v-if="extraCount" class="text-xs font-medium leading-none">+{{ extraCount }}</span>
    </span>

    <button v-if="isActive" class="rounded-full" @click.stop="$emit('clear')">
      <i-ph-x-bold
        class="w-4 h-4 text-secondary"
      />
    </button>
    <i-ph-caret-down-bold
      v-else
      class="w-4 h-4 rounded-full"
    />
  </button>
</template>
