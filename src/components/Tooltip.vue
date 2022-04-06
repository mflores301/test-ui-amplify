<script setup lang="ts">
import { arrow, flip, offset, shift } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/core'
import useFloatingUi from '~/composables/useFloatingUi'

const props = defineProps<{
  disabled?: boolean
  placement?: Placement
}>()

const activator = ref(null as Element | null)
const tooltip = ref(null as HTMLElement | null)
const arrowElement = ref(null as HTMLElement | null)

const middleware = [flip(), offset(12), shift({ padding: 8 })]
const { currentPlacement, floatingStyles: tooltipStyles, middlewareData, updateFloating } = useFloatingUi(activator, tooltip, props.placement || 'top', middleware, { arrow, arrowElement })

const isVisible = ref(false)

const arrowStyles = computed(() => {
  if (!middlewareData.value.arrow)
    return {}

  const { x, y } = middlewareData.value.arrow!
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[currentPlacement.value.split('-')[0]]

  return {
    left: x != null ? `${x}px` : undefined,
    top: y != null ? `${y}px` : undefined,
    right: undefined,
    bottom: undefined,
    [staticSide || 'bottom']: '-8px',
  }
})

const show = async() => {
  if (props.disabled)
    return

  await updateFloating()
  isVisible.value = true
}

onMounted(() => {
  updateFloating()
})

// TODO: (a11y) - hide tooltip on Escape key
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role
</script>

<template>
  <div class="relative">
    <div
      ref="activator"
      class="h-full w-full"
      v-bind="{
        'tabindex': disabled ? -1 : 0
      }"
      @focusin="show()"
      @focusout="isVisible = false"
      @mouseenter="show()"
      @mouseleave="isVisible = false"
    >
      <slot name="activator" v-bind="{ isVisible, show }" />
    </div>
    <Teleport to="body">
      <div
        ref="tooltip"
        v-bind="$attrs"
        class="absolute z-100 py-2 px-3 text-sm pointer-events-none text-white bg-gray-500 rounded-md shadow-md transition transform-gpu duration-300"
        :class="isVisible ? '' : 'opacity-0'"
        role="tooltip"
        :style="tooltipStyles"
      >
        <div class="max-w-sm w-max">
          <slot />
        </div>
        <div
          ref="arrowElement"
          :style="arrowStyles"
          class="absolute w-4 h-4 bg-gray-500 transform rotate-45"
        />
      </div>
    </Teleport>
  </div>
</template>
