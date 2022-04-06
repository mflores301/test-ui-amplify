<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  end?: string
  start?: string
}>()

const emit = defineEmits(['save', 'update:modelValue'])

const form = reactive({
  effective_date_start: props.start || '',
  effective_date_end: props.end || '',
})

const open = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    form.effective_date_start = props.start || ''
    form.effective_date_end = props.end || ''
  }
})
</script>

<template>
  <Dialog v-model="open" max-width="600px">
    <div class="flex flex-col h-full">
      <header class="px-4 py-2 font-semibold border-b flex justify-between">
        Effective dates

        <button class="rounded-full p-1" @click="open = false">
          <i-ph-x-bold />
        </button>
      </header>

      <div class="flex space-x-2 p-4">
        <FormKit
          v-model="form.effective_date_start"
          type="date"
          label="Effective date start"
          validation="required"
          validation-visibility="live"
          outer-class="mb-5"
          label-class="block mb-1 font-bold text-sm"
          inner-class="max-w-md border border-gray-400 rounded-md mb-1 overflow-hidden focus-within:border-primary"
          input-class="w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 outline-none"
          help-class="text-xs text-gray-500"
        />
        <FormKit
          v-model="form.effective_date_end"
          type="date"
          label="Effective date end"
          validation="required"
          validation-visibility="live"
          outer-class="mb-5"
          label-class="block mb-1 font-bold text-sm"
          inner-class="max-w-md border border-gray-400 rounded-md mb-1 overflow-hidden focus-within:border-primary"
          input-class="w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 outline-none"
          help-class="text-xs text-gray-500"
        />
      </div>

      <footer class="flex justify-end items-center px-4 py-2 border-t space-x-2">
        <button class="py-2 px-4" @click="open = false">
          Cancel
        </button>

        <button class="btn" @click="emit('save', form)">
          Save
        </button>
      </footer>
    </div>
  </Dialog>
</template>
