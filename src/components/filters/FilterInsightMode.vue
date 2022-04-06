<script setup lang="ts">
interface FilterItem {
  label: string
  value: string
}

const root = ref(null)
const chip = ref(null)

const activeFilters = ref({} as Record<string, string>)
const open = ref(false)

const items = [
  { label: 'Active', value: 'active' },
  { label: 'Observing', value: 'observing' },
  { label: 'Inactive', value: 'inactive' },
]

const activeFilterLabels = computed(() => Object.values(activeFilters.value))

const clearFilters = () => {
  activeFilters.value = {}
  open.value = false
}

const removeFilter = (itemKey: string) => {
  const filters = { ...activeFilters.value }
  delete filters[itemKey]
  activeFilters.value = filters
}

const updateFilters = (item: FilterItem) => {
  if (!item)
    return

  if (activeFilters.value[item.value])
    removeFilter(item.value)

  else
    activeFilters.value = { ...activeFilters.value, [item.value]: item.label }
}

const emit = defineEmits(['change'])
watch(activeFilters, (val) => {
  emit('change', val)
})

</script>

<template>
  <div ref="root" class="relative inline-block">
    <div ref="chip">
      <FilterChip
        v-model="activeFilterLabels"
        class="h-full"
        label="Insight Mode"
        @click="open = true"
        @clear="clearFilters()"
      />
    </div>
    <FloatingUi
      v-if="open"
      :anchor="chip"
      placement="bottom-start"
      class="card shadow-lg z-100 bg-white w-xs"
      @click-outside="open = false"
    >
      <FilterMenu title="Insight Mode" @close="open = false" @clear="clearFilters()">
        <ul class="p-1">
          <li v-for="item in items" :key="item.value">
            <button
              class="flex items-center h-9 rounded-md p-2 pr-4 w-full hover:bg-primary-light-hover hover:text-gray-800"
              @click="updateFilters(item)"
            >
              <input
                type="checkbox"
                class="sibling mr-3 appearance-none border pointer-events-none w-4 h-4 focus:ring checked:bg-secondary checked:opacity-10 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :checked="!!activeFilters[item.value]"
                aria-label="checkbox"
              >
              <i-ph-check class="w-5 h-5 mr-2 absolute text-secondary" :class="!!activeFilters[item.value] ? '' : 'opacity-0'" />
              <div
                class="text-xs leading-none whitespace-nowrap w-content"
              >
                {{ item.label }}
              </div>
            </button>
          </li>
        </ul>
      </FilterMenu>
    </FloatingUi>
  </div>
</template>
