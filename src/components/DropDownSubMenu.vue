<script setup lang="ts">
import FloatingUi from './FloatingUi.vue'

interface FilterItem {
  label: string
  value: string
}
defineProps<{
  modelValue: Record<string, string>
  label: string
  items: FilterItem[]
}>()

defineEmits(['select'])

const open = ref(false)

const root = ref(null as Element | null)

onClickOutside(root, () => {
  open.value = false
})

</script>

<template>
  <li ref="root" class="w-full rounded-md px-1" @mouseenter="open = true" @mouseleave="open=false">
    <button
      class="flex items-center h-9 rounded-md pl-4 p-2 w-full hover:bg-primary-light-hover hover:text-gray-800"
      :class="open ? ['bg-primary-light-hover'] : []"
      @click="open = !open"
    >
      <div class="text-xs text-left leading-none whitespace-nowrap flex-1">
        {{ label }}
      </div>
      <i-ph-caret-right-bold class="w-5 h-5 text-gray-500 mr-0" />
    </button>
    <FloatingUi v-if="open" :anchor="root" class="card shadow-lg" placement="right-start">
      <ul class="p-1">
        <li v-for="item in items" :key="item.value">
          <button
            class="flex items-center h-9 rounded-md p-2 pr-4 w-full hover:bg-primary-light-hover hover:text-gray-800"
            @click="$emit('select', item)"
          >
            <i-ph-check class="w-5 h-5 mr-2" :class="modelValue[item.value] ? 'opacity-100' : 'opacity-0'" />
            <div class="text-xs leading-none whitespace-nowrap w-content">
              {{ item.label }}
            </div>
          </button>
        </li>
      </ul>
    </FloatingUi>
  </li>
</template>
