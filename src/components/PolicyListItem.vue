<script setup lang="ts">
const props = defineProps<{
  id?: number | string
  status: 'active' | 'observing'
  name: string
  insightRate: number
  savings: number | string
}>()

const labelColor = computed(() => props.status === 'active' ? 'primary' : 'tertiary')

const rootEl = ref(null)
const { width } = useElementSize(rootEl)
</script>

<template>
  <li ref="rootEl" class="px-4 lg:px-8 py-2 bg-white w-full h-19">
    <div class="container mx-auto flex space-x-5 items-center justify-start h-full">
      <div class="flex-1 flex flex-col space-y-1 items-start justify-start">
        <Label class="capitalize" :color="labelColor">
          {{ status }}
        </Label>
        <p class="text-sm font-medium leading-tight text-gray-800">
          {{ name }}
        </p>
      </div>
      <div class="relative flex flex-1 space-x-8 items-center h-full p-3" :class="width > 600 ? ['justify-start'] : ['justify-end']">
        <div class="inline-flex flex-col space-y-1 items-center justify-center">
          <div class="inline-flex space-x-1 items-center justify-start">
            <p class="text-xs leading-tight text-center text-gray-500">
              <i-ph-lightbulb class="w-4 inline-block" />
              <span v-if="width > 600" class="ml-1">Insight Rate</span>
            </p>
          </div>
          <p class="text-sm leading-tight text-center text-gray-800">
            {{ insightRate }}%
          </p>
        </div>
        <div class="w-px h-full bg-gray-300" />
        <div class="inline-flex flex-col space-y-1 items-center justify-center">
          <div class="inline-flex space-x-1 items-center justify-start">
            <p class="text-xs leading-tight text-center text-gray-500">
              <IconSavings class="w-4 h-4 rounded-full inline-block" />
              <span v-if="width > 600" class="ml-1">Savings Opportunity</span>
            </p>
          </div>
          <p class="text-sm leading-tight text-center text-gray-800">
            ${{ savings }}
          </p>
        </div>
      </div>
    </div>
  </li>
</template>
