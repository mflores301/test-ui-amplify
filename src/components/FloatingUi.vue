<script setup lang="ts">
import { flip, shift } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import type { Ref } from 'vue'
import useFloatingUi from '../composables/useFloatingUi'

const props = defineProps<{
  anchor: Ref<Element>
  placement: Placement
}>()

const emit = defineEmits(['click-outside'])

const root = ref(null as HTMLElement | null)

const middleware = [flip(), shift({ padding: 8 })]
const { floatingStyles, updateFloating } = useFloatingUi(props.anchor, root, props.placement, middleware)

onMounted(() => {
  updateFloating()
})

onClickOutside(root, (e) => {
  emit('click-outside', e)
})

</script>

<template>
  <div ref="root" class="absolute card z-100" :style="floatingStyles">
    <slot />
  </div>
</template>
