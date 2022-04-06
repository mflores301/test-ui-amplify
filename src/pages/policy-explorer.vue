<script setup lang="ts">
import FilterSources from '../components/filters/FilterSources.vue'
import { usePolicies } from '~/stores/policies'
import InputSearch from '~/components/InputSearch.vue'
import TableHeader from '~/components/TableHeader.vue'
import FilterInsightMode from '~/components/filters/FilterInsightMode.vue'

const route = useRoute()
const router = useRouter()
useHead({
  title: 'Policy Explorer | Rialtic demo',
})

const policiesDb = usePolicies()

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const statuses: Record<number, string> = {
  1: 'Active',
  2: 'Observing',
  3: 'Observing',
  4: 'Inactive',
}

const policies = computed(() => policiesDb.all.map(policy => ({
  ...policy,
  status: statuses[Math.round(getRandomArbitrary(1, 4))],
  insightRate: (getRandomArbitrary(50, 1000) / 100).toFixed(2),
  savings: `${Math.round(getRandomArbitrary(9, 900))}k`,
})))

const search = ref('')

debouncedWatch(search, (q, prevQ) => {
  if (q === prevQ)
    return

  if (q)
    policiesDb.search(q)

  else
    policiesDb.getAll()
}, {
  debounce: 450,
})

const activeFilters = reactive({
  editType: [] as string[],
  insightMode: [] as string[],
  source: [] as string[],
  topic: [] as string[],
})

const updateFilters = (updates: Record<string, string>, filterName: string) => {
  activeFilters[filterName] = Object.values(updates)
}

const filteredPolicies = computed(() => policies.value.filter((policy) => {
  let showItem = true
  if (activeFilters.insightMode.length)
    showItem = activeFilters.insightMode.includes(policy.status)

  if (showItem && activeFilters.editType.length)
    showItem = activeFilters.editType.includes(policy.subdomain)

  if (showItem && activeFilters.source.length)
    showItem = activeFilters.source.includes(policy.source)

  if (showItem && activeFilters.topic.length)
    showItem = activeFilters.topic.includes(policy.topic)

  return showItem
}))

type sortValue = 'up' | 'down' | undefined
const sortState = ref({
  column: 'name',
  sort: 'up' as sortValue,
})

const getSortState = (name: string) => {
  return sortState.value.column === name ? sortState.value.sort : undefined
}

const setSortState = (name: string) => {
  sortState.value = sortState.value.column === name
    ? {
      ...sortState.value,
      sort: sortState.value.sort === 'up' ? 'down' : sortState.value.sort === 'down' ? undefined : 'up',
    }
    : {
      column: name,
      sort: 'up',
    }
}

const sortedPolicies = computed(() => {
  return filteredPolicies.value.sort((a, b) => {
    const aValue = a[sortState.value.column] as string
    if (aValue == null)
      return 0

    const bValue = b[sortState.value.column] as string

    const result = aValue.localeCompare(bValue)
    return sortState.value.sort === 'down' ? result * -1 : result
  })
})

const isListView = computed(() => route.name === 'policy-explorer')
</script>

<template>
  <main class="relative">
    <header class="px-4 pt-1 lg:px-8 bg-white">
      <h1 class="text-lg lg:text-2xl py-3 font-semibold leading-9 text-gray-800">
        Policies
      </h1>
    </header>
    <header class="sticky top-16 px-4 py-3 lg:px-8 border-b bg-white z-1">
      <div class="flex">
        <div class="w-[200px]">
          <InputSearch v-model="search" :loading="policiesDb.loading" placeholder="Search policies" />
        </div>

        <div class="flex items-center ml-2 space-x-2">
          <FilterPolicyTopic @change="val => updateFilters(val, 'topic')" />
          <FilterEditTypes @change="val => updateFilters(val, 'editType')" />
          <FilterSources @change="val => updateFilters(val, 'source')" />
          <FilterInsightMode @change="val => updateFilters(val, 'insightMode')" />
        </div>
      </div>
    </header>
    <section class="relative flex pb-8">
      <table class="flex-grow">
        <thead class="sticky top-30 relative bg-gray-100">
          <td class="pl-4 lg:pl-8">
            <TableHeader
              :sort="getSortState('status')"
              @click="setSortState('status')"
            >
              Mode
            </TableHeader>
          </td>
          <td class="px-3">
            <TableHeader
              :sort="getSortState('name')"
              @click="setSortState('name')"
            >
              Name
            </TableHeader>
          </td>

          <td align="center" class="px-3">
            <Tooltip :disabled="isListView">
              <template #activator>
                <TableHeader
                  center
                  :sort="getSortState('insightRate')"
                  @click="setSortState('insightRate')"
                >
                  <i-ph-lightbulb class="w-4 h-4 inline-block" />

                  <span v-if="isListView" class="pl-1">Insight rate</span>
                </TableHeader>
              </template>
              Insight rate
            </Tooltip>
          </td>
          <td align="center" class="mr-auto px-3">
            <Tooltip :disabled="isListView">
              <template #activator>
                <TableHeader
                  :sort="getSortState('savings')"
                  @click="setSortState('savings')"
                >
                  <IconSavings class="w-4 h-4 rounded-full inline-block" />
                  <span v-if="isListView" class="pl-1">Savings Opportunity</span>
                </TableHeader>
              </template>
              Savings Opportunity
            </Tooltip>
          </td>
          <td v-if="isListView" />
          <div class="w-full h-px bg-gray-200 absolute bottom-0 transform translate-y-px left-0 right-0" />
        </thead>

        <tbody class="divide-y bg-white w-full">
          <tr
            v-for="policy in sortedPolicies"
            :key="policy.id"
            class="group text-sm cursor-pointer"
            :class="route.path.includes(`/policy-explorer/${policy.id}`) ? ['bg-primary-light-hover hover:primary-light-hover'] : ['hover:bg-background-light']"
            tabindex="0"
            @keyup.enter="router.push(`/policy-explorer/${policy.id}`)"
            @click="router.push(`/policy-explorer/${policy.id}`)"
          >
            <td class="pl-4 lg:pl-8">
              <Label
                class="capitalize"
                :color="policy.status === 'Active' ? 'primary' : policy.status === 'Observing' ? 'tertiary' : undefined"
              >{{ policy.status }}</Label>
            </td>
            <td
              class="p-3 font-medium group-hover:underline"
              :class="isListView ? 'whitespace-nowrap' : ''"
            >
              {{ policy.name }}
            </td>
            <td class="p-3 text-center text-cool-gray-900">
              {{ policy.insightRate }}%
            </td>
            <td class="p-3 text-center text-cool-gray-900">
              ${{ policy.savings }}
            </td>
            <td v-if="isListView" class="w-full" />
          </tr>
        </tbody>
      </table>
      <router-view />
    </section>
  </main>
</template>
