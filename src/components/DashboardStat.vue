<script setup lang="ts">
defineProps<{
  modelValue: any
  title: string
  tooltip: string
}>()

</script>

<template>
  <div
    class="flex-col space-y-3 items-center justify-center flex-1 h-full p-4 card"
  >
    <div class="flex space-x-2 items-center justify-center w-full">
      <p class="sm:text-lg md:text-base xl:text-lg font-medium leading-7 text-center text-gray-800">
        {{ title }}
      </p>
      <Tooltip v-if="tooltip">
        <template #activator>
          <button class="flex items-center rounded-full">
            <i-ph-info class="w-5 h-5 text-gray-500" />
          </button>
        </template>
        <div class="p-2">
          <span class="text-xs leading-none">{{ tooltip }}</span>
        </div>
      </Tooltip>
    </div>
    <div class="flex items-center w-full divide-x">
      <div
        v-for="{ label, value } in modelValue"
        :key="label"
        class="flex-col items-center justify-center flex-1 py-2"
      >
        <p
          class="text-2xl md:text-xl xl:text-3xl font-medium leading-10 text-center text-gray-600 mb-1 uppercase"
        >
          {{ value }}
        </p>
        <p class="text-xs leading-none text-center text-gray-500">
          {{ label }}
        </p>
      </div>
    </div>
  </div>
</template>
