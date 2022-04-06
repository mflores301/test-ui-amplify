<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  name?: string
}>()

const emit = defineEmits(['save', 'update:modelValue'])

const policyName = ref('')

const open = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen)
    policyName.value = props.name || ''
})
</script>

<template>
  <Dialog v-model="open" max-width="600px">
    <div class="flex flex-col h-full">
      <header class="px-4 py-2 font-semibold border-b flex justify-between">
        Policy name

        <button class="rounded-full p-1" @click="open = false">
          <i-ph-x-bold />
        </button>
      </header>

      <div class="flex space-x-2 p-4">
        <FormKit
          v-model="policyName"
          type="text"
          label="Policy name"
          validation="required"
          validation-visibility="live"
          outer-class="w-full"
          label-class="block mb-1 font-bold text-sm"
          inner-class="max-w-md border border-gray-400 rounded-md mb-1 overflow-hidden focus-within:border-primary !max-w-full w-full"
          input-class="w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400 outline-none w-full"
          help-class="text-xs text-gray-500"
        />
      </div>

      <footer class="flex justify-end items-center px-4 py-2 border-t space-x-2">
        <button class="py-2 px-4" @click="open = false">
          Cancel
        </button>

        <button class="btn" @click="emit('save', policyName)">
          Save
        </button>
      </footer>
    </div>
  </Dialog>
</template>
