<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import showdown from 'showdown'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits(['update:modelValue'])

const getHtml = (content: string) => {
  const converter = new showdown.Converter()
  const output = converter.makeHtml(content)
  return output
}

const editor = useEditor({
  content: getHtml(props.modelValue || ''),
  extensions: [
    StarterKit,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose focus:outline-none border border-2 focus:border-primary focus:ring ring-offset rounded p-2',
    },
  },
  onUpdate: () => {
    const converter = new showdown.Converter()
    const output = editor.value?.getHTML()
    emit('update:modelValue', converter.makeMarkdown(output || '').replace(/<!-- -->/g, ''))
  },
})

// watch(() => props.modelValue, (value) => {
//   const isSame = editor.value?.getHTML() === getHtml(value || '')

//   if (isSame)
//     return

//   editor.value?.commands.setContent(value || '', false)
// })

</script>

<template>
  <EditorContent :editor="editor" />
</template>
