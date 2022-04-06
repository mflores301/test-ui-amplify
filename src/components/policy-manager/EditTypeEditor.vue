<script setup lang="ts">
import type { EditType } from '~/stores/dbEditTypes'
import { useEditTypes } from '~/stores/dbEditTypes'

type ActiveEditTypes = Record<string, Omit<EditType, 'active'>>

const editTypesDb = useEditTypes()

const props = defineProps<{
  modelValue: boolean
  editTypes?: Omit<EditType, 'active'>[]
}>()

const emit = defineEmits(['save', 'update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const activeEditTypes = ref({} as ActiveEditTypes)

watch(() => props.modelValue, (isOpen, prevIsOpen) => {
  if (isOpen && !prevIsOpen && props.editTypes) {
    activeEditTypes.value = props.editTypes.reduce((editTypes, item) => {
      editTypes[item.id] = item
      return editTypes
    }, {} as ActiveEditTypes)
  }
})

const removeEditType = (itemKey: string) => {
  const filters = { ...activeEditTypes.value }
  delete filters[itemKey]
  activeEditTypes.value = filters
}

const updateEditType = (item: EditType) => {
  if (!item)
    return

  if (activeEditTypes.value[item.id])
    removeEditType(item.id)

  else
    activeEditTypes.value = { ...activeEditTypes.value, [item.id]: item }
}
</script>
<template>
  <Dialog v-model="open" max-width="480px">
    <div class="flex flex-col h-full">
      <header class="px-4 py-2  border-b">
        <div class="font-semibold w-full flex justify-between">
          Edit types

          <button class="rounded-full p-1" @click="open = false">
            <i-ph-x-bold />
          </button>
        </div>
        <!-- <div class="grid gap-2 grid-cols-auto grid-flow-row-dense">
          <div v-for="editType in activeEditTypes" :key="editType.id" class="block">
            <div class="flex space-x-1 items-center justify-between w-full pl-3 pr-2 py-1 bg-white border rounded-full border-gray-300">
              <p class="text-xs font-medium leading-none text-center text-gray-800">
                {{ editType.name }}
              </p>
              <button class="p-1 rounded-full" @click="removeEditType(editType.id)">
                <i-ph-x-bold class="h-3" />
              </button>
            </div>
          </div>
        </div> -->
      </header>

      <div class="flex-1 overflow-y-auto">
        <ul class="px-1">
          <li v-for="item in editTypesDb.all" :key="item.id">
            <!-- <input type="checkbox" :aria-label="`Toggle ${item.name}`" class="mr-2 pointer-events-none" :checked="!!activeEditTypes[item.id]"> {{ item.name }} -->
            <ListItemCheckbox :checked="!!activeEditTypes[item.id]" @click="updateEditType(item)">
              {{ item.name }}
            </ListItemCheckbox>
          </li>
        </ul>
      </div>
      <footer class="flex justify-end items-center px-4 py-2 border-t space-x-2">
        <button class="py-2 px-4" @click="open = false">
          Cancel
        </button>

        <button class="btn" @click="emit('save', Object.values(activeEditTypes))">
          Save
        </button>
      </footer>
    </div>
  </Dialog>
</template>
