<script setup lang="ts">
import A11yDialog from 'a11y-dialog' // https://a11y-dialog.netlify.app/

const props = defineProps<{
  fullscreen?: boolean
  maxWidth?: string
  modelValue?: boolean
  noBackdrop?: boolean
  persistent?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const dialogContainer = ref(null as Element | null)
const dialogEl = ref(null)

const dialog = ref(null as A11yDialog | null)

const hide = () => {
  emit('update:modelValue', false)
}
const show = () => {
  emit('update:modelValue', true)
}

onMounted(async() => {
  dialog.value = new A11yDialog(dialogContainer.value as Element)
  dialog.value.on('hide', () => {
    hide()
  })

  dialog.value.on('show', () => {
    show()
  })
})

onBeforeUnmount(() => {
  dialog.value?.destroy()
})

watch(() => props.modelValue, (isOpen, prevIsOpen) => {
  if (!dialog.value || isOpen === prevIsOpen)
    return

  const html = document.documentElement
  if (!isOpen) {
    html.style.overflowY = ''

    dialog.value.hide()
    return
  }

  html.style.overflowY = 'hidden'
  dialog.value.show()
}, {
  immediate: true,
})

onClickOutside(dialogEl, () => {
  if (props.persistent)
    return

  emit('update:modelValue', false)
})
</script>

<template>
  <Teleport to="body">
    <!-- TODO: use alert dialog when persistent -->
    <!-- https://a11y-dialog.netlify.app/advanced/alert-dialog -->
    <div
      ref="dialogContainer"
      class="dialog-container fixed inset-0 h-screen w-full z-1066"
      aria-hidden
    >
      <div
        data-a11y-dialog-hide
        class="absolute inset-0 h-full w-full bg-black opacity-70 transform -z-1 animate-fade-in"
      />
      <div class="flex flex-col justify-center h-full">
        <div
          ref="dialogEl"
          v-bind="$attrs"
          role="document"
          class="relative card w-full mx-auto transition scale-100 overflow-hidden"
          :class="{
            'h-screen w-full rounded-none max-h-screen': fullscreen,
            'dialog-sizing container': !fullscreen,
            'opacity-0 -translate-y-3 scale-50': !modelValue,
          }"
          :style="fullscreen ? {} : {
            maxWidth
          }"
        >
          <slot v-bind="{ hide, open: modelValue, show }" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-container[aria-hidden="true"] {
    display: none;
}

.dialog-sizing {
  max-height: 90vh;
  max-width: 90vw;
}
</style>
