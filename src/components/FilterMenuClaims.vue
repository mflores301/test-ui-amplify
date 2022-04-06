<script setup lang="ts">
import FloatingUi from './FloatingUi.vue'
import DropDownSubMenu from './DropDownSubMenu.vue'

interface FilterItem {
  label: string
  value: string
}

const activeFilters = ref({} as Record<string, string>)

const root = ref(null)
const buttonEl = ref(null as Element | null)
const open = ref(false)

const item1Open = ref(false)

const toggleRoot = () => {
  if (open.value) {
    open.value = false
    item1Open.value = false
  }
  else {
    open.value = true
  }
}

const filterSections = [
  {
    id: 'topic',
    label: 'Policy Topic',
    items: [
      { label: 'Anesthesia', value: 'topic_anesthesia' },
      { label: 'Behavioral Health', value: 'topic_behavioral_health' },
      { label: 'Chiropractor', value: 'topic_chiropractor' },
      { label: 'Drugs and Biologicals', value: 'topic_drugs_biologicals' },
      { label: 'Gastroenterology', value: 'topic_gastroenterology' },
      { label: 'Lab', value: 'topic_lab' },
    ],
  }, {
    id: 'editType',
    label: 'Edit Type',
    items: [
      { label: 'Age Requirements', value: 'edit_type_age_requirements' },
      { label: 'Combinations', value: 'edit_type_combinations' },
      { label: 'Diagnoses', value: 'edit_type_diagnoses' },
      { label: 'DME', value: 'edit_type_dme' },
      { label: 'Frequency', value: 'edit_type_frequency' },
      { label: 'Modifiers', value: 'edit_type_modifiers' },
      { label: 'Place of Service', value: 'edit_type_place_of_service' },
    ],
  },
  {
    id: 'mode',
    label: 'Policy Mode',
    value: 'test',
    items: [
      { label: 'Active', value: 'mode_active' },
      { label: 'Observing', value: 'mode_observing' },
      { label: 'Inactive', value: 'mode_inactive' },
    ],
  },
  {
    id: 'source',
    label: 'Source',
    items: [
      { label: 'LCD/LCA', value: 'source_lcd_lca' },
      { label: 'medicaid Health Policy', value: 'source_medicaid Health Policy' },
      { label: 'medicaid Health Alert', value: 'source_medicaid Health alert' },
      { label: 'medicare Claims Processing Manual', value: 'source_medicare_claims_processing_manual' },
      { label: 'Medicare National Coverage Determinations Manual', value: 'source_medicare_national_coverage_determinations_manual' },
    ],
  },
]

const removeFilter = (itemKey: string) => {
  // activeFilters.value = activeFilters.value.filter(activeItem => activeItem.value !== item.value)
  delete activeFilters.value[itemKey]
}

const updateFilters = (item: FilterItem) => {
  if (!item)
    return

  if (activeFilters.value[item.value])
    removeFilter(item.value)

  else
    activeFilters.value = { ...activeFilters.value, [item.value]: item.label }
}

onClickOutside(root, () => {
  open.value = false
})
</script>

<template>
  <div class="relative flex h-full items-center">
    <div ref="root" class="h-full">
      <button
        ref="buttonEl"
        class="relative flex space-x-2.5 items-center justify-start h-full pr-3 mr-2 bg-white border rounded-md border-secondary"
        @click="toggleRoot()"
      >
        <div class="text-xs leading-6 text-secondary pl-3">
          + Add Filter
        </div>
        <i-ph-caret-down-bold class="w-4 h-4 text-secondary" />
      </button>
      <FloatingUi v-if="open" :anchor="buttonEl" placement="bottom-start" class="card shadow-lg text-gray z-100 bg-white">
        <ul class="relative w-60 py-1">
          <DropDownSubMenu
            v-for="filters in filterSections"
            :key="filters.id"
            v-model="activeFilters"
            :label="filters.label"
            :items="filters.items"
            @select="updateFilters"
          />
        </ul>
      </FloatingUi>
    </div>
    <div
      v-for="(filter, key) in activeFilters"
      :key="key"
      class="inline-flex items-center justify-center h-full px-3 py-0.5 bg-secondary bg-opacity-20 rounded-md mr-2"
    >
      <p class="text-xs font-medium text-center text-secondary-dark">
        {{ filter }}
      </p>
      <button class="text-secondary p-1 rounded-full" @click="removeFilter(key)">
        <i-ph-x-bold class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
