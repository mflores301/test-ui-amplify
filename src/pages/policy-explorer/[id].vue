<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import type { Ref } from 'vue'
import type { Policy } from '~/stores/policies'
import { usePolicies } from '~/stores/policies'
import { useSettingsStore } from '~/stores/settings'

const props = defineProps<{
  id: string
}>()

const rootRef = ref(null)
const toolbarHeight = inject('toolbarHeight') as Ref<number>

const { height: viewHeight } = useWindowSize()
const breakpoints = useBreakpoints(breakpointsTailwind)

const height = computed(() => breakpoints.greater('lg').value ? viewHeight.value : viewHeight.value - toolbarHeight.value)

const router = useRouter()
onKeyStroke('Escape', (e) => {
  e.preventDefault()
  router.push('/policy-explorer')
})

const policiesDb = usePolicies()
const settings = useSettingsStore()

const activePolicy = ref({} as Partial<Policy>)

watch(() => props.id, async(id) => {
  if (!id) {
    activePolicy.value = {}
    router.replace('/404')
    return
  }

  const res = await policiesDb.get(id)

  if (res === null)
    location?.reload() // hack to refresh token

  activePolicy.value = res || {}
}, {
  immediate: true,
})

</script>

<template>
  <div ref="rootRef" class="relative md:w-3xl md:min-w-3xl">
    <transition appear appear-from-class="translate-x-100">
      <aside class="fixed bottom-0 right-0 w-full transition transform-gpu translate-x-0 md:w-3xl bg-white border-l z-40 lg:pt-4 lg:z-1" :style="{ height: `${height}px`}">
        <header class="flex px-4 lg:px-8 py-2 justify-between h-12">
          <div class="inline-flex space-x-3 items-center justify-center">
            <button class="flex space-x-2 items-center justify-center h-full px-3 py-1 bg-primary text-white rounded-lg">
              <p class="text-sm font-medium leading-tight">
                Active
              </p>
              <i-heroicons-solid-pencil />
            </button>
            <p class="text-xs leading-none">
              <span class="text-gray-500">Policy Mode:</span> Active since Jan 1, 2021
            </p>
          </div>
          <RouterLink to="/policy-explorer">
            <i-ph-x-bold />
          </RouterLink>
        </header>
        <div class="h-full overflow-y-auto overscroll-contain ">
          <div class="px-4 lg:px-8 flex flex-col space-y-2">
            <section>
              <p class="text-lg font-medium leading-relaxed text-gray-800 mb-2">
                {{ activePolicy.name }}
              </p>
              <div class="flex space-x-1 items-start justify-start">
                <div v-if="activePolicy.topic" class="flex space-x-1 items-center justify-center h-full px-3 py-1 bg-cool-gray-100 border rounded-md border-cool-gray-100">
                  <p class="text-xs leading-none text-center text-cool-gray-500">
                    Policy Topic
                  </p>
                  <p class="text-xs font-medium leading-none text-center text-cool-gray-900">
                    {{ activePolicy.topic }}
                  </p>
                </div>
                <div v-if="activePolicy.subdomain" class="flex space-x-1 items-center justify-center h-full px-3 py-1 bg-cool-gray-100 border rounded-md border-cool-gray-100">
                  <p class="text-xs leading-none text-center text-cool-gray-500">
                    Edit Type
                  </p>
                  <p class="text-xs font-medium leading-none text-center text-cool-gray-900">
                    {{ activePolicy.subdomain }}
                  </p>
                </div>
              </div>
            </section>
            <div class="relative">
              <div class="inline-flex space-x-10 items-start justify-start">
                <div class="inline-flex flex-col space-y-0.5 items-start justify-start">
                  <div class="inline-flex items-center justify-center py-2">
                    <p class="text-xs font-medium leading-none text-center text-primary">
                      Details
                    </p>
                  </div>
                  <div class="w-full h-0.5 bg-primary rounded-full" />
                </div>
                <a class="flex items-center justify-center py-2" href="#referenceDocuments">
                  <p class="text-xs leading-none text-center text-gray-500">
                    Reference Docs
                  </p>
                </a>
                <div class="flex items-center justify-center py-2">
                  <p class="text-xs leading-none text-center text-gray-500">
                    Analytics
                  </p>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 bg-gray-300 h-px w-full" />
            </div>
            <section v-if="activePolicy.description" class="inline-flex flex-col space-y-2 items-start justify-center p-5 bg-gray-100 rounded-lg">
              <p class="text-xs font-medium leading-none text-gray-800">
                Description
              </p>
              <p class="text-xs text-gray-80">
                {{ activePolicy.description }}
              </p>
              <div class="inline-flex items-center justify-center py-0.5">
                <p class="text-xs font-semibold leading-none text-secondary">
                  View More
                </p>
              </div>
            </section>
            <!-- <section v-if="activePolicy.defense_policy_excerpt" class="inline-flex flex-col space-y-2 items-start justify-center p-5 bg-gray-100 rounded-lg">
            <p class="text-xs font-medium leading-none text-gray-800">
              Policy Excerpt
            </p>
            <p class="text-xs max-w-full">
              {{ activePolicy.defense_policy_excerpt }}
            </p>
            <div class="inline-flex items-center justify-center py-0.5">
              <p class="text-xs font-semibold leading-none text-secondary">
                View More
              </p>
            </div>
          </section> -->
            <section class="inline-flex flex-col items-start justify-center bg-gray-100 rounded-lg">
              <div class="p-5 w-full space-y-3">
                <table>
                  <tbody>
                    <!-- <tr class="h-6">
                    <td class="py-2 pr-4 text-xs font-medium leading-none text-gray-800">
                      Source
                    </td>
                    <td class="text-xs leading-none text-gray-800">
                      {{ activePolicy.source }}
                    </td>
                  </tr>
                  <tr class="h-6">
                    <td class="py-2 pr-4 text-xs font-medium leading-none text-gray-800">
                      Region
                    </td>
                    <td class="text-xs leading-none text-gray-800">
                      {{ activePolicy.region }}
                    </td>
                  </tr> -->
                    <tr class="h-6">
                      <td class="py-2 pr-4 text-xs font-medium leading-none text-gray-800">
                        Effective Dates
                      </td>
                      <td class="text-xs leading-none text-gray-800 px-4">
                        Oct 1, 2021 - Dec 31, 2021
                      </td>
                    </tr>
                    <tr class="h-6">
                      <td class="py-2 pr-4 text-xs font-medium leading-none text-gray-800">
                        CPT® Range(s)
                      </td>
                      <td class="text-xs leading-none font-medium text-secondary-dark px-4">
                        {{ activePolicy.procedure_codes }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              <!-- <button class="inline-flex items-center justify-center px-8 py-2 border rounded-lg border-secondary w-full">
                <p class="text-xs font-semibold leading-none text-center text-secondary">
                  View Source Document
                </p>
              </button> -->
              </div>
            </section>

            <section class="pt-8">
              <div class="mb-4">
                <p id="referenceDocuments" class="text-base font-medium leading-normal text-gray-800">
                  Reference Documents
                </p>
                <div class="bg-gray-300 w-full h-px" />
              </div>
              <div class="flex flex-col border divide-y rounded-lg shadow">
                <div class="flex flex-col items-start justify-start bg-white rounded-tl-lg rounded-tr-lg border-gray-200">
                  <div class="flex space-x-2 items-center justify-between px-5 h-16 w-full">
                    <div class="flex-1 flex flex-col items-start justify-center">
                      <p class="text-xs font-medium text-gray-800">
                        Medicare Claims Processing Manual, Chapter 12
                      </p>
                      <p class="text-xs text-gray-500">
                        Primary Source
                      </p>
                    </div>
                    <button class="p-1 rounded-full">
                      <i-ph-caret-down-bold class="w-4 h-4 rounded-full" />
                    </button>
                  </div>
                <!-- <div class="flex flex-col items-center justify-center pl-0.5">
                  <div class="bg-white" style="width: 693px; height: 1px;" />
                </div> -->
                </div>
                <div class="flex flex-col items-start justify-start bg-white">
                  <div class="inline-flex items-center justify-between px-5 h-16 w-full">
                    <div>
                      <p class="text-xs font-medium leading-none text-gray-800">
                        Medicare Claims Processing Manual
                      </p>
                    </div>
                    <button class="p-1 rounded-full">
                      <i-ph-caret-down-bold class="w-4 h-4 rounded-full" />
                    </button>
                  </div>
                  <div class="flex flex-col items-center justify-center pl-0.5">
                    <div class="bg-white" />
                  </div>
                </div>
                <div class="inline-flex items-start justify-start bg-white rounded-bl-lg rounded-br-lg">
                  <div class="flex items-center justify-between px-5 h-16 w-full">
                    <div>
                      <p class="text-xs font-medium leading-none text-gray-800">
                        Medicare Physician Fee Schedule
                      </p>
                    </div>
                    <button class="p-1 rounded-full">
                      <i-ph-caret-down-bold class="w-4 h-4 rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="pt-8">
              <div class="mb-4">
                <div class="flex justify-between items-center">
                  <p id="analytics" class="text-base font-medium leading-normal text-gray-800">
                    Analytics
                  </p>

                  <div class="text-sm font-medium leading-tight text-primary">
                    <span>{{ settings.activeConnector.label }}</span>
                    •
                    <span>{{ settings.getTimeFrame(settings.activeTimeFrame)?.label || '' }}</span>
                  </div>
                </div>
                <div class="bg-gray-300 w-full h-px" />
              </div>
            </section>

          <!-- <section class="inline-flex flex-col space-y-1 items-start justify-center p-5 bg-gray-100 rounded-lg">
            <p class="text-xs font-medium leading-none text-gray-800">
              Associated Documents
            </p>
            <div class="inline-flex items-center justify-center py-0.5">
              <p class="text-xs font-semibold leading-none text-secondary">
                Medicare Claims Processing Manual
              </p>
            </div>
            <div class="inline-flex items-center justify-center py-0.5">
              <p class="text-xs font-semibold leading-none text-secondary">
                Medicare Physician Fee Schedule
              </p>
            </div>
          </section> -->
          </div>
          <footer class="px-4 lg:px-8  text-xs italic bg-gray-200 w-full py-2 pb-16 text-gray-700">
            CPT® copyright 2022 American Medical Association. All rights reserved.
          </footer>
        </div>
      </aside>
    </transition>
  </div>
</template>
