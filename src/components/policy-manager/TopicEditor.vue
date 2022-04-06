<script setup lang="ts">
import ListItemTick from '../lists/ListItemTick.vue'
import { useTopics } from '~/stores/dbTopics'
const topicsDb = useTopics()

const props = defineProps<{
  modelValue: boolean
  topic?: string
}>()

const emit = defineEmits(['save', 'update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const activeTopic = ref(props.topic || '')

watch(() => props.modelValue, (isOpen, prevIsOpen) => {
  if (isOpen && !prevIsOpen)
    activeTopic.value = props.topic || ''
})
</script>
<template>
  <Dialog v-model="open" max-width="680px">
    <div class="flex flex-col h-full">
      <header class="px-4 py-2  border-b">
        <div class="font-semibold w-full flex justify-between mb-2">
          Topics

          <button class="rounded-full p-1" @click="open = false">
            <i-ph-x-bold />
          </button>
        </div>
        <div class="flex justify-between">
          <div class="flex space-x-1 items-center justify-center h-full px-3 py-2 bg-white border rounded-full border-gray-300">
            <p class="text-xs leading-none text-center text-gray-500">
              Policy Topic
            </p>
            <p v-if="activeTopic" class="text-xs font-medium leading-none text-center text-gray-800">
              {{ activeTopic }}
            </p>
            <p v-else class="text-xs italic text-gray-600">
              Choose topic
            </p>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto">
        <ul class="px-1">
          <li v-for="{ id, name } in topicsDb.all" :key="id">
            <ListItemTick
              :checked="name === activeTopic"
              @click="activeTopic = name"
            >
              {{ name }}
            </ListItemTick>
          </li>
        </ul>
      </div>
      <footer class="flex justify-end items-center px-4 py-2 border-t space-x-2">
        <button class="py-2 px-4" @click="open = false">
          Cancel
        </button>

        <button class="btn" @click="emit('save', activeTopic)">
          Save
        </button>
      </footer>
    </div>
  </Dialog>
</template>
