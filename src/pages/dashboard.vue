<script setup lang="ts">
import Dialog from '~/components/Dialog.vue'
import { useNumeralFormatWithTransition } from '~/composables/useNumeral'
import type { DemoStats } from '~/stores/dbDemoStats'
import { useDemoStats } from '~/stores/dbDemoStats'
import type { EditType } from '~/stores/dbEditTypes'
import { useEditTypes } from '~/stores/dbEditTypes'
import type { ProcedureType } from '~/stores/dbProcedureTypes'
import { useProcedureTypes } from '~/stores/dbProcedureTypes'
import { TimeFrameIds, timeFrameItems, useSettingsStore } from '~/stores/settings'

const settings = useSettingsStore()
const demoStats = useDemoStats()

const procedureTypes = useProcedureTypes()
const editTypes = useEditTypes()

useHead({
  title: 'Dashboard | Rialtic demo',
})

const demoFirstName = useStorage('@rialitc/demo_first-name', 'Eva')

const dashboardStats = useStorage('@rialtic/demo:dashboard_stats', {
  claimsTotal: 0,
  claimsVolume: 0,
  insightsActive: 0,
  insightsObserving: 0,
  savingsActive: 0,
  savingsObserving: 0,
} as DemoStats)

watch(() => settings.activeConnector, async(active, prevActive) => {
  if (active.statsId === prevActive?.statsId)
    return

  dashboardStats.value = (await demoStats.getById(active.statsId)) || {}
}, {
  immediate: true,
})

const timeframe = computed(() => timeFrameItems[settings.activeTimeFrame as TimeFrameIds || TimeFrameIds.days_30])

const claimsTotalWithTime = computed(() => (dashboardStats.value.claimsTotal * (timeframe.value.multiple || 1)))
const claimsVolumeWithTime = computed(() => (dashboardStats.value.claimsVolume * (timeframe.value.multiple || 1)))
const claimsTotal = useNumeralFormatWithTransition(claimsTotalWithTime, '0a')
const claimsVolume = useNumeralFormatWithTransition(claimsVolumeWithTime, '0a')

const insightsActiveWithTime = computed(() => ((dashboardStats.value.insightsActive ? dashboardStats.value.insightsActive / 100 : 0) * (timeframe.value.rateChange || 1)))
const insightsObservingWithTime = computed(() => ((dashboardStats.value.insightsObserving ? dashboardStats.value.insightsObserving / 100 : 0) * (timeframe.value.rateChange || 1)))
const insightsActive = useNumeralFormatWithTransition(insightsActiveWithTime, '0.[00]%')
const insightsObserving = useNumeralFormatWithTransition(insightsObservingWithTime, '0.[00]%')

const savingsActiveWithTime = computed(() => (dashboardStats.value.savingsActive * (timeframe.value.multiple || 1)))
const savingsObservingWithTime = computed(() => (dashboardStats.value.savingsObserving * (timeframe.value.multiple || 1)))
const savingsActive = useNumeralFormatWithTransition(savingsActiveWithTime, '$0.[0]a')
const savingsObserving = useNumeralFormatWithTransition(savingsObservingWithTime, '$0.[0]a')

const savingsData = computed(() => [
  {
    value: savingsActive.value,
    label: 'Active',
  },
  {
    value: savingsObserving.value,
    label: 'Observing',
  },
])
const insightData = computed(() => [
  {
    value: insightsActive.value,
    label: 'Active',
  },
  {
    value: insightsObserving.value,
    label: 'Observing',
  },
])
const claimsData = computed(() => [
  {
    value: claimsVolume.value,
    label: 'Claim volume',
  },
  {
    value: claimsTotal.value,
    label: 'Total claims',
  },
])

interface Stat {
  count?: number
  countObserving?: number
  rate?: number
  rateObserving?: number
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const createStats = (items: ProcedureType[] | EditType[]) => {
  return items.reduce((stats, { id }) => {
    stats[id] = {
      count: getRandomArbitrary(8.43881857e-9, 4.21940928e-7),
      countObserving: getRandomArbitrary(8.43881857e-9, 4.21940928e-7),
      rate: getRandomArbitrary(4, 50),
      rateObserving: getRandomArbitrary(5, 40),
    }
    return stats
  }, {} as Record<number, Stat>)
}

const randomPTStats = ref({} as Record<number, Stat>)
const randomETStats = ref({} as Record<number, Stat>)

const generateStats = () => {
  randomPTStats.value = createStats(procedureTypes.all || [])
  randomETStats.value = createStats(editTypes.all || [])
}

onMounted(() => {
  if (!Object.keys(randomPTStats.value).length || !Object.keys(randomETStats.value).length)
    generateStats()
})

watch([() => procedureTypes.active, () => editTypes.active], (current, prev) => {
  const [pTypes, eTypes] = current
  if (!pTypes.length || !eTypes.length)
    return
  const [prevPTypes, prevETypes] = prev
  if (pTypes.length === prevPTypes.length && eTypes.length === prevETypes.length)
    return

  generateStats()
})

const insightDataByProcedureType = computed(() => procedureTypes.active.map(({ id, name }) => {
  const { count, countObserving, rate, rateObserving } = { count: 0, countObserving: 0, rate: 0, rateObserving: 0, ...randomPTStats.value[id] }
  return {
    id,
    label: name,
    count: Math.round(claimsVolumeWithTime.value * count),
    countObserving: Math.round(claimsVolumeWithTime.value * countObserving),
    rate: Math.round(insightsActiveWithTime.value * rate * 100) / 100,
    rateObserving: Math.round(insightsObservingWithTime.value * rateObserving * 100) / 100,
  }
}).sort((a, b) => (b.rate + b.rateObserving) - (a.rate + a.rateObserving)),
)

const insightDataByEditType = computed(() => editTypes.active.map(({ id, name }) => {
  const { count, countObserving, rate, rateObserving } = { count: 0, countObserving: 0, rate: 0, rateObserving: 0, ...randomETStats.value[id] }
  return {
    id,
    label: name,
    count: Math.round(claimsVolumeWithTime.value * count),
    countObserving: Math.round(claimsVolumeWithTime.value * countObserving),
    rate: Math.round(insightsActiveWithTime.value * rate * 100) / 100,
    rateObserving: Math.round(insightsObservingWithTime.value * rateObserving * 100) / 100,
  }
}).sort((a, b) => (b.rate + b.rateObserving) - (a.rate + a.rateObserving)),
)

const procedureTypeDialogOpen = ref(false)
const editTypeDialogOpen = ref(false)

const timestamp = useThrottle(useTimestamp(), 1000)
const hourOfDay = computed(() => new Date(timestamp.value).getHours())

const timeOfDay = computed(() => {
  return hourOfDay.value < 12
    ? 'morning'
    : hourOfDay.value < 18
      ? 'afternoon'
      : 'evening'
})
const welcomeMessage = computed(() => `Good ${timeOfDay.value}, ${demoFirstName.value}.`)

const router = useRouter()
const navToPolicies = (barLabel: string, filter: string) => {
  router.push({
    name: 'policy-explorer',
    query: {
      [filter]: encodeURIComponent(barLabel),
    },
  })
}

</script>
<template>
  <main class="p-4 lg:p-8">
    <div class="max-w-[2560px] mx-auto relative pb-8">
      <section class="inline-flex w-full items-end justify-end mb-4 lg:mb-8">
        <h2
          class="hidden md:inline w-full text-lg lg:text-3xl font-medium text-gray-800"
        >
          {{ welcomeMessage }}
        </h2>
      </section>
      <section class="grid grid-cols-6 gap-4 lg:gap-8 w-full">
        <DashboardStat
          v-model="savingsData"
          class="col-span-6 md:col-span-3 lg:col-span-2"
          title="Savings opportunity"
          tooltip="The estimated dollar value of savings opportunity for insights generated. Savings opportunity is calculated using historical paid amounts."
        />
        <DashboardStat
          v-model="insightData"
          class="col-span-6 md:col-span-3 lg:col-span-2"
          title="Insight rate"
          tooltip="The percentage of claims processed for which at least one actionable insight was generated."
        />
        <DashboardStat
          v-model="claimsData"
          class="col-span-6 lg:col-span-2"
          title="Claims processed"
          tooltip="The number of claims processed by Rialtic for the selected line(s) of business and time period."
        />

        <!-- Graphs -->
        <div
          class="col-span-6 xl:col-span-3 flex-col items-start justify-start card overflow-hidden"
        >
          <div class="p-4 lg:px-6 lg:pt-8">
            <InsightChart v-model="insightDataByProcedureType" title="Procedure Type" @click-bar="barLabel => navToPolicies(barLabel, 'topic')" />
          </div>
          <Dialog v-model="procedureTypeDialogOpen">
            <template #default="{ hide }">
              <div class="p-4 lg:py-8 lg:px-10">
                <InsightChart v-model="insightDataByProcedureType" controls title="Procedure Type" @click-bar="barLabel => navToPolicies(barLabel, 'topic')">
                  <template #title>
                    <div class="inline-flex flex-col space-y-1 items-start justify-end h-14">
                      <p
                        class="text-xl font-medium leading-7 text-gray-800"
                      >
                        Insights by Procedure Type
                      </p>
                      <p
                        class="text-base font-medium leading-normal text-primary-light"
                      >
                        {{ settings.activeConnector.label }} • {{ timeframe.label }}
                      </p>
                    </div>
                  </template>
                  <template #dialog-close>
                    <button class="p-1 self-start" @click="hide()">
                      <i-ph-x-bold class="h-5 w-5 text-gray-500 stroke-2" />
                    </button>
                  </template>
                </InsightChart>
              </div>
            </template>
          </Dialog>
          <button class="bg-gray-500 w-full h-10" @click="procedureTypeDialogOpen = true">
            <span class="text-white font-semibold text-sm">View more</span>
          </button>
        </div>
        <!-- Graph 2 -->
        <div
          class="col-span-6 xl:col-span-3 flex-col items-center justify-start card overflow-hidden"
        >
          <div class="p-4 lg:px-6 lg:pt-8">
            <InsightChart v-model="insightDataByEditType" title="Edit Type" @click-bar="barLabel => navToPolicies(barLabel, 'editType')" />
          </div>
          <Dialog v-model="editTypeDialogOpen">
            <template #default="{ hide }">
              <div class="p-4 lg:py-8 lg:px-10">
                <InsightChart v-model="insightDataByEditType" controls title="Edit Type" @click-bar="barLabel => navToPolicies(barLabel, 'editType')">
                  <template #title>
                    <div class="inline-flex flex-col space-y-1 items-start justify-end h-14">
                      <p class="text-xl font-medium leading-7 text-gray-800">
                        Insights by Edit Type
                      </p>
                      <p
                        class="text-base font-medium leading-normal text-primary-light"
                      >
                        {{ settings.activeConnector.label }} • {{ timeframe.label }}
                      </p>
                    </div>
                  </template>
                  <template #dialog-close>
                    <button class="p-1 self-start rounded-full" @click="hide()">
                      <i-ph-x-bold class="h-5 w-5 text-gray-500 stroke-2" />
                    </button>
                  </template>
                </InsightChart>
              </div>
            </template>
          </Dialog>
          <button class="bg-gray-500 w-full h-10" @click="editTypeDialogOpen = true">
            <span class="text-white font-semibold text-sm">View more</span>
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
