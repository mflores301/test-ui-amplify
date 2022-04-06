<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  editorContent?: string
}>()

const emit = defineEmits(['save', 'update:modelValue'])

const content = ref('')
const fullscreen = ref(false)

const open = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen)
    content.value = props.editorContent || ''
})

</script>

<template>
  <Dialog v-model="open" :fullscreen="fullscreen" max-width="600px">
    <div class="flex flex-col h-full">
      <header class="px-4 py-2 font-semibold border-b flex justify-between">
        Policy Description

        <div class="flex space-x-2">
          <button class="rounded-full p-1" @click="fullscreen = !fullscreen">
            <i-ph-corners-in-bold v-if="fullscreen" />
            <i-ph-corners-out-bold v-else />
          </button>
          <button class="rounded-full p-1" @click="open = false">
            <i-ph-x-bold />
          </button>
        </div>
      </header>

      <div class="flex-1 p-4 overflow-y-auto">
        <div class="container mx-auto flex justify-center">
          <RichTextEditor v-if="open" v-model="content" />
        </div>
      </div>

      <footer class="flex justify-end items-center px-4 py-2 border-t space-x-2">
        <button class="py-2 px-4" @click="open = false">
          Cancel
        </button>

        <button class="btn" @click="emit('save', content)">
          Save
        </button>
      </footer>
    </div>
  </Dialog>
</template>
