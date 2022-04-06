<script setup lang="ts">
import type { Placement } from '@floating-ui/dom'
import { flip, shift } from '@floating-ui/dom'

import useFloatingUi from '~/composables/useFloatingUi'

interface Item extends Record<string, any> {
  label: string
  value: string | number
}

interface Props {
  modelValue: Item
  items: Item[]
  footer?: Item[]
  placement?: Placement
}

const props = withDefaults(defineProps<Props>(),
  {
    items: () => [],
    placement: 'bottom-start',
  },
)

const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const button = ref(null as Element | null)
const menu = ref(null as HTMLElement | null)

const isVisible = ref(false)

const middleware = [flip(), shift({ padding: 8 })]
const { floatingStyles, updateFloating } = useFloatingUi(button, menu, props.placement, middleware)

const selectItem = (item: Item) => {
  emit('update:modelValue', item)
  isVisible.value = false
}

const show = async() => {
  await updateFloating()
  isVisible.value = true
}

onClickOutside(root, async() => {
  await nextTick()

  isVisible.value = false
})

const toggleMenu = async() => {
  if (isVisible.value)
    isVisible.value = false

  else
    show()
}

</script>

<template>
  <div ref="root" class="relative">
    <button ref="button" class="flex w-40 space-x-2.5 items-center justify-between w-full flex-1 px-4 py-2 bg-white border rounded-md border-gray-300" @click="toggleMenu()">
      <p class="block text-xs leading-tight text-gray-800 h-4 truncate">
        {{ modelValue.label }}
      </p>
      <i-ph-caret-down-bold class="w-4 h-4" />
    </button>
    <div ref="menu" :style="floatingStyles" class="z-10 absolute card shadow-lg p-1 w-48" :class="isVisible ? '' : 'opacity-0 pointer-events-none'">
      <ul class="flex-col space-y-1">
        <li v-for="item in items" :key="item.value">
          <button
            class="flex items-center h-9 rounded-md p-2 w-full hover:bg-background-light hover:text-gray-800"
            :disabled="!isVisible"
            @click="selectItem(item)"
          >
            <i-ph-check class="w-5 h-5 mr-2" :class="modelValue.value === item.value ? 'opacity-100' : 'opacity-0'" />
            <div class="text-xs leading-none whitespace-nowrap">
              {{ item.label }}
            </div>
          </button>
        </li>
        <div v-if="footer && footer.length" class="h-px w-full bg-gray-300" />
        <li v-for="item in footer" :key="item.value">
          <button
            class="flex items-center h-9 rounded-md p-2 w-full hover:bg-primary-light-hover hover:text-gray-800"
            :class="modelValue.value === item.value ? 'bg-primary-light text-white' : ''"
            :disabled="!isVisible"
            @click="selectItem(item)"
          >
            <i-ph-check class="w-5 h-5 mr-2" :class="modelValue.value === item.value ? 'opacity-100' : 'opacity-0'" />
            <div class="text-xs leading-none whitespace-nowrap">
              {{ item.label }}
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
