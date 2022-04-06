<script setup lang="ts">
import { format } from 'date-fns'
import InputSearch from '~/components/InputSearch.vue'
import TableHeader from '~/components/TableHeader.vue'

const route = useRoute()
const router = useRouter()
useHead({
  title: 'Claim Explorer | Rialtic demo',
})

// const { arrivedState, directions } = useScroll(document, { offset: { top: 64 } })

// const scrollingDown = useDebounce(computed(() => directions.bottom), 350)
// const showFilters = computed(() => arrivedState.top || !scrollingDown.value)
interface ClaimsItem {
  id: string
  insightCount: number
  claimLinesImpacted: number
  claimLinesTotal: number
  dateOfService: Date
}
const claims = ref([
  {
    id: '123456789',
    insightCount: 3,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '0123456789A',
    insightCount: 3,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '0987654321',
    insightCount: 3,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '3456789012',
    insightCount: 3,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '4567890123',
    insightCount: 3,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '5678901234',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '6789012345',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '0123456789B',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '7890123456',
    insightCount: 2,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '8901234567',
    insightCount: 2,
    claimLinesImpacted: 1,
    claimLinesTotal: 3,
    dateOfService: new Date(),
  },
  {
    id: '9012345678',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '9012345678A',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '0123456789B',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '0123456789B',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '0123456789B1',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
  {
    id: '0123456789B2',
    insightCount: 8,
    claimLinesImpacted: 3,
    claimLinesTotal: 4,
    dateOfService: new Date(),
  },
] as ClaimsItem[])

const search = ref('')

// const sortByItems = [
//   { label: 'Alphabetical', value: 'alphabetical' },
//   { label: 'Effective Start Date', value: 'start_date' },
//   { label: 'Insight rate', value: 'insight_rate' },
//   { label: 'Savings', value: 'savings' },
//   { label: 'Claim volume', value: 'claim_volume' },
// ]
// const sortBy = ref(sortByItems[0])

const sortByMode = ref('up' as 'down' | 'up' | undefined)

const isListView = computed(() => route.name === 'claim-explorer')
</script>

<template>
  <main class="relative">
    <header class="px-4 pt-1 lg:px-8 bg-white">
      <h1 class="text-lg lg:text-2xl py-3 font-semibold leading-9 text-gray-800">
        Claims
      </h1>
    </header>
    <header class="sticky top-16 px-4 py-3 lg:px-8 border-b bg-white z-1">
      <div class="flex">
        <div class="w-[200px]">
          <InputSearch v-model="search" placeholder="Search claims" />
        </div>

        <div class="flex items-center ml-2 space-x-2">
          <FilterPolicyTopic />
          <FilterEditTypes />
          <FilterSources />
          <FilterInsightMode />
        </div>
      </div>
    </header>

    <section class="relative flex pb-8">
      <table class="flex-grow">
        <thead class="sticky top-30 bg-gray-100 border-b">
          <th align="center" class="mr-auto pl-4 lg:pl-8">
            <TableHeader>
              Date
            </TableHeader>
          </th>
          <th class="px-3">
            <TableHeader
              :sort="sortByMode"
              @click="sortByMode = sortByMode === 'up' ? 'down' : sortByMode === 'down' ? undefined : 'up'"
            >
              Claim ID
            </TableHeader>
          </th>

          <th align="center" class="px-3">
            <Tooltip :disabled="isListView">
              <template #activator>
                <TableHeader center>
                  <i-ph-lightbulb class="w-4 h-4 inline-block" />

                  <span v-if="isListView" class="pl-1">Insights</span>
                </TableHeader>
              </template>
              Insights
            </Tooltip>
          </th>
          <th align="center" class="mr-auto px-3">
            <Tooltip :disabled="isListView">
              <template #activator>
                <TableHeader>
                  <i-ph-warning class="w-4 h-4 rounded-full inline-block" />
                  <span v-if="isListView" class="pl-1">Claim Lines Impacted</span>
                </TableHeader>
              </template>
              Claim Lines Impacted
            </Tooltip>
          </th>
          <th v-if="isListView" class="lg:w-xs" />
        </thead>

        <tbody class="divide-y bg-white w-full">
          <tr
            v-for="claim in claims"
            :key="claim.id"
            class="group text-sm cursor-pointer"
            :class="route.path.includes(`/claim-explorer/${claim.id}`) ? ['bg-primary-light-hover hover:primary-light-hover'] : ['hover:bg-background-light']"
            tabindex="0"
            @click="router.push(`/claim-explorer/${claim.id}`)"
            @keyup.enter="router.push(`/claim-explorer/${claim.id}`)"
          >
            <td
              class="whitespace-nowrap pl-4 lg:pl-8 pr-3"
            >
              <div class="inline-flex items-center justify-center w-16 px-2 py-1 bg-gray-100 rounded-md">
                <p class="text-xs font-medium leading-none text-center text-gray-600">
                  {{ format(claim.dateOfService, 'MMM dd') }}
                </p>
              </div>
            </td>
            <td class="p-3 font-medium w-full group-hover:underline">
              {{ claim.id }}
            </td>
            <td
              class="p-3 text-center text-cool-gray-900 whitespace-nowrap"
            >
              {{ claim.insightCount }}
            </td>
            <td
              class="p-3 text-center text-cool-gray-900 whitespace-nowrap"
            >
              {{ claim.claimLinesImpacted }} of {{ claim.claimLinesTotal }}
            </td>

            <td v-if="isListView" class="lg:min-w-xs" />
          </tr>
        </tbody>
      </table>
      <router-view />
    </section>
  </main>
</template>
