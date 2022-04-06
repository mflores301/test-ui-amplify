<script setup lang="ts">
import type { DemoStats } from '~/stores/dbDemoStats'
import { useDemoStats } from '~/stores/dbDemoStats'
import { useLinesOfBusiness } from '~/stores/dbLinesOfBusiness'
import { numeral } from '~/composables/useNumeral'

interface LineOfBusinessItem {
  id: number
  name: string
}
interface FormattedDemoStats extends Omit<DemoStats, 'claimsTotal' | 'claimsVolume' | 'savingsActive' | 'savingsObserving'> {
  assignedTo: LineOfBusinessItem[]
  claimsTotal: string
  claimsVolume: string
  savingsActive: string
  savingsObserving: string
}

const demoStats = useDemoStats()
const lineOfBusiness = useLinesOfBusiness()

const abbrNumber = (num: number) => numeral(num).format('0.0a')

const statsList = computed(() => demoStats.all.map((statRow) => {
  const assignedTo = lineOfBusiness.all.filter(({ stats: statsId }) => statsId && statsId === statRow.id).map(({ id, name }) => ({ id, name }))

  return {
    ...statRow,
    claimsTotal: abbrNumber(statRow.claimsTotal),
    claimsVolume: abbrNumber(statRow.claimsVolume),
    savingsActive: abbrNumber(statRow.savingsActive),
    savingsObserving: abbrNumber(statRow.savingsObserving),
    assignedTo,
  } as FormattedDemoStats
}))

const dialogOpen = ref(false)
const statsForm = reactive({

} as Partial<DemoStats>)

const editId = ref(null as number | null)
const duplicate = ref(false)

const edit = ({ id, ...item }: FormattedDemoStats) => {
  statsForm.claimsTotal = numeral(item.claimsTotal).value() || 0
  statsForm.claimsVolume = numeral(item.claimsVolume).value() || 0
  statsForm.insightsActive = item.insightsActive
  statsForm.insightsObserving = item.insightsObserving
  statsForm.label = item.label
  statsForm.savingsActive = numeral(item.savingsActive).value() || 0
  statsForm.savingsObserving = numeral(item.savingsObserving).value() || 0

  editId.value = id

  dialogOpen.value = true
}

const copy = (item: FormattedDemoStats) => {
  duplicate.value = true
  edit({ ...item, label: `${item.label} (copy)` })
}

const save = async(item: Partial<DemoStats>) => {
  if (editId.value && !duplicate.value) {
    await demoStats.update(item, editId.value)
    editId.value = null
  }
  else { await demoStats.add(item) }

  duplicate.value = false
  dialogOpen.value = false
}

</script>

<template>
  <section class="card">
    <header class="flex p-4 items-center justify-between">
      <h2 class="font-semibold text-lg text-gray-600 tracking-wide">
        Demo stats
      </h2>

      <button class="btn" @click="editId = null; dialogOpen = true">
        Create
      </button>
      <Dialog v-model="dialogOpen" class="max-w-sm">
        <header class="p-4">
          <span class="text-gray-600">
            {{ editId != null && !duplicate ? 'Edit demo stats' : 'Create new demo stats' }}
          </span>
        </header>
        <div class="px-4">
          <div class="flex-1">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Stats label</div>
              <input
                v-model.trim="statsForm.label"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Claims total</div>
              <input
                v-model.number="statsForm.claimsTotal"
                type="number"
                inputmode="numeric"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Claims volume</div>
              <input
                v-model.number="statsForm.claimsVolume"
                type="number"
                inputmode="numeric"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>

            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Insights active</div>
              <input
                v-model.number="statsForm.insightsActive"
                step="0.01"
                type="number"
                inputmode="decimal"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>

            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Insights observing</div>
              <input
                v-model.number="statsForm.insightsObserving"
                step="0.01"
                type="number"
                inputmode="decimal"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>

            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Savings active</div>
              <input
                v-model.number="statsForm.savingsActive"
                type="number"
                inputmode="numeric"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>

            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Savings observing</div>
              <input
                v-model.number="statsForm.savingsObserving"
                type="number"
                inputmode="numeric"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>
          </div>
        </div>
        <footer class="flex justify-end space-x-4 p-4">
          <button class="" @click="dialogOpen = false">
            Cancel
          </button>
          <button class="btn" @click="save(statsForm)">
            Save
          </button>
        </footer>
      </Dialog>
    </header>

    <ul class="py-4 divide-y">
      <li v-for="stat in statsList" :key="stat.id" class="px-4 py-2 flex justify-between">
        <div>
          <p class="font-semibold tracking-wide mb-1">
            {{ stat.label }}
          </p>
          <div class="-m-1 flex flex-wrap">
            <div class="m-1 border border-2 rounded px-2">
              <p class="text-xs">
                Claims
              </p>
              <p class="text-sm">
                Volume: <span class="uppercase font-semibold">{{ stat.claimsVolume }}</span>
              </p>
              <p class="text-sm">
                Total: <span class="uppercase font-semibold">
                  {{ stat.claimsTotal }}
                </span>
              </p>
            </div>
            <div class="m-1 border border-2 rounded px-2">
              <p class="text-xs">
                Insights
              </p>
              <p class="text-sm">
                Active: <span class="font-semibold">{{ stat.insightsActive }}%</span>
              </p>
              <p class="text-sm">
                Observing: <span class="font-semibold">{{ stat.insightsObserving }}%</span>
              </p>
            </div>
            <div class="m-1 border border-2 rounded px-2">
              <p class="text-xs">
                Savings
              </p>
              <p class="text-sm">
                Active: <span class="uppercase font-semibold">{{ stat.savingsActive }}</span>
              </p>
              <p class="text-sm">
                Observing: <span class="uppercase font-semibold">{{ stat.savingsObserving }}</span>
              </p>
            </div>
          </div>
          <p class="text-xs mt-1">
            Assigned to:
          </p>
          <div class="-m-1 flex flex-wrap">
            <template v-if="stat.assignedTo.length">
              <div v-for="{ id, name } in stat.assignedTo" :key="id" class="m-1 text-xs rounded bg-gray-300 px-2 py-px">
                {{ name }}
              </div>
            </template>
            <span v-else class="m-1 text-xs rounded bg-gray-300 px-2">Unassigned</span>
          </div>
        </div>

        <div class="flex items-start space-x-2 text-gray-600">
          <button class="p-1" @click="edit(stat)">
            <i-ph-pencil />
          </button>
          <button class="p-1" @click="copy(stat)">
            <i-ph-copy />
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
