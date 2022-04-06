<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import type { Ref } from 'vue'
defineProps<{
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
  router.push('/claim-explorer')
})

</script>

<template>
  <div ref="rootRef" class="relative md:w-3xl md:min-w-3xl">
    <transition appear appear-from-class="translate-x-100">
      <aside
        class="fixed bottom-0 right-0 w-full transition transform-gpu translate-x-0 md:w-3xl bg-white border-l z-40 lg:pt-4 lg:z-1"
        :style="{ height: `${height}px` }"
      >
        <header class="flex px-4 lg:px-8 py-2 justify-between h-12">
          <div class="inline-flex space-x-3 items-center justify-center">
            <h2 class="text-xl font-medium text-gray-800">
              Claim ID 123456789
            </h2>
          </div>
          <RouterLink to="/claim-explorer">
            <i-ph-x-bold />
          </RouterLink>
        </header>
        <div class="h-full overflow-y-auto overscroll-contain px-4 lg:px-8 flex flex-col space-y-3">
          <section>
            <p class="text-xs leading-none text-gray-500 mb-1">
              Date of service: February 2, 2022
            </p>
          </section>
          <div class="relative w-full">
            <div class="inline-flex space-x-10 items-start justify-start">
              <div class="inline-flex flex-col space-y-0.5 items-start justify-start">
                <div class="inline-flex items-center justify-center py-0.5">
                  <p class="text-xs font-medium leading-none text-center text-primary">
                    Claim lines
                  </p>
                </div>
                <div class="w-full h-0.5 bg-primary rounded-full" />
              </div>
              <div class="flex items-center justify-center py-0.5">
                <p class="text-xs leading-none text-center text-gray-500">
                  Insights
                </p>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 bg-gray-300 h-px w-full" />
          </div>
          <section class="my-1">
            <h3 class="text-lg font-medium leading-7 text-gray-800 mb-3">
              Claim Lines (3)
            </h3>

            <div class="flex space-x-2 items-center justify-start snap-x">
              <div
                class="span-center flex flex-col items-center justify-around h-23 w-54 p-2 bg-primary bg-opacity-10 shadow border rounded-md border-gray-100 border-opacity-0"
              >
                <p
                  class="w-full text-base font-medium leading-normal text-center text-gray-800"
                >
                  Claim Line #1
                </p>
                <p
                  class="w-full text-xs font-medium leading-none text-center text-primary text-opacity-80"
                >
                  4 insights
                </p>
                <i-ph-caret-down-bold
                  class="transform rotate-0 w-5 h-5 text-primary text-opacity-80 rounded-lg"
                />
              </div>
              <div
                class="span-center flex flex-col items-center justify-around h-23 w-54 p-2 bg-white bg-opacity-30 border rounded-md border-gray-100"
              >
                <p
                  class="w-full text-base font-medium leading-normal text-center text-gray-400"
                >
                  Claim Line #2
                </p>
                <p
                  class="w-full text-xs font-medium leading-none text-center text-gray-400"
                >
                  2 insights
                </p>
                <i-ph-caret-down-bold
                  class="transform rotate-180 w-5 h-5 text-gray-300 rounded-lg"
                />
              </div>
              <div
                class="span-center flex flex-col items-center justify-around h-23 w-54 p-2 bg-white bg-opacity-30 border rounded-md border-gray-100"
              >
                <p
                  class="w-full text-base font-medium leading-normal text-center text-gray-400"
                >
                  Claim Line #3
                </p>
                <p
                  class="w-full text-xs font-medium leading-none text-center text-gray-400"
                >
                  2 insights
                </p>
                <i-ph-caret-down-bold
                  class="transform rotate-180 w-5 h-5 text-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>
          <section
            class="p-5 bg-gray-100 rounded-lg"
          >
            <p class="text-xs font-medium leading-none text-gray-800 mb-3">
              Claim Line Details
            </p>
            <div class="grid grid-cols-4 gap-4">
              <div class="">
                <p class="text-xs leading-3 text-gray-600 text-opacity-90 mb-1">
                  SERVICE FROM
                </p>
                <p class="text-xs leading-none text-gray-800">
                  2022-02-22
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  SERVICE TO
                </p>
                <p class="text-xs leading-none text-gray-800">
                  2022-02-22
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  PLACE OF SERVICE
                </p>
                <p class="text-xs leading-none text-gray-800">
                  21 (Inpatient Hospital)
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  EMG
                </p>
                <p class="text-xs leading-none text-gray-800">
                  —
                </p>
              </div>
              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  CPT/HCPCS
                </p>
                <p class="text-xs leading-none text-gray-800">
                  99213
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  MODIFIER
                </p>
                <p class="text-xs leading-none text-gray-800">
                  —
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  DIAGNOSIS POINTER
                </p>
                <p class="text-xs leading-none text-gray-800">
                  A
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  $ CHARGES
                </p>
                <p class="text-xs leading-none text-gray-800">
                  $143.27
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  DAYS OR UNITS
                </p>
                <p class="text-xs leading-none text-gray-800">
                  1
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  EPSDT FAMILY PLAN
                </p>
                <p class="text-xs leading-none text-gray-800">
                  —
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  ID QUAL
                </p>
                <p class="text-xs leading-none text-gray-800">
                  NPI
                </p>
              </div>

              <div class="">
                <p class="text-xs leading-3 text-gray-600 mb-1">
                  PROVIDER ID
                </p>
                <p class="text-xs leading-none text-gray-800">
                  2787734657
                </p>
              </div>
            </div>
          </section>
          <h4
            clas="text-base font-medium leading-normal text-gray-800"
          >
            Insights for Claim Line #1 (4)
          </h4>
          <section class="inline-flex flex-col items-start justify-start shadow rounded-lg border border-gray-100 divide-y">
            <div
              class="flex flex-col items-start justify-start bg-gray-100 rounded-t-lg 0 w-full"
            >
              <div class="flex items-center justify-between p-5 w-full">
                <div class="flex space-x-2 items-center justify-start">
                  <div class="inline-flex flex-col space-y-2 items-start justify-start">
                    <p
                      class="text-base font-medium leading-normal text-gray-800"
                    >
                      0 and 10 Day Global (Minor Surgery)
                    </p>
                    <p class="w-44 h-1/3 text-xs leading-none text-gray-500">
                      SELECTED EDIT
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Label color="primary">Active</Label>
                  <button class="p-1 rounded-full">
                    <i-ph-caret-down-bold class="w-5 h-5 text-cool-gray-900" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col items-center justify-center pl-0.5">
                <div class="bg-gray-100" />
              </div>
            </div>
            <div
              class="flex flex-col items-start justify-start p-5 bg-white w-full"
            >
              <div class="flex space-x-4 items-center justify-between w-full">
                <p class="text-xs font-medium leading-none text-gray-800">
                  Claim Line Not Payable
                </p>
                <div class="flex items-center justify-center px-2.5 py-0.5 bg-gray-100 rounded-md">
                  <p class="text-center text-sm text-gray-800">
                    <span class="text-xs">Policy Topic:</span> Anesthesia
                  </p>
                </div>
              </div>
              <p
                class="text-sm text-gray-500 py-3"
              >
                Claim Line: 99213 (E/M) included as part of global surgery package for 58552 (Surgery – Lap Assisted Vaginal Hysterectomy) due to no modifier (25 or 57) on 99213.
              </p>
              <div class="grid grid-cols-2 gap-4 items-center w-full">
                <button
                  class="flex flex-1 items-center justify-center flex-1 px-3 py-2 border rounded-lg border-secondary text-secondary"
                >
                  <i-ph-lightbulb class="w-6 h-full mr-4" />
                  <p
                    class="text-xs font-medium leading-none text-center"
                  >
                    Insight Explanation
                  </p>
                </button>
                <button
                  class="flex flex-1  items-center justify-center flex-1 px-3 py-2 border rounded-lg border-secondary text-secondary"
                >
                  <i-ph-books class="w-6 h-full mr-4" />
                  <p class="text-xs font-medium leading-none text-center">
                    Policy Details
                  </p>
                </button>
              </div>
            </div>
            <div
              class="flex flex-col items-start justify-start bg-white w-full"
            >
              <div
                class="flex flex-col items-center justify-center pl-0.5"
              >
                <div class="bg-white" />
              </div>
              <div
                class="inline-flex items-start justify-between p-5 w-full"
              >
                <div
                  class="flex space-x-2 items-center justify-start"
                >
                  <div
                    class="inline-flex flex-col items-start justify-start"
                  >
                    <p
                      class="text-base font-medium leading-normal text-gray-400"
                    >
                      ICD-10-CM Code Validation
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Label color="primary">Active</Label>
                  <button class="p-1 rounded-full">
                    <i-ph-caret-down-bold class="w-5 h-5 text-cool-gray-900" />
                  </button>
                </div>
              </div>
              <div
                class="flex flex-col items-center justify-center pl-0.5"
              >
                <div class="bg-white" />
              </div>
            </div>
            <div
              class="flex flex-col items-start justify-start bg-white w-full"
            >
              <div
                class="flex flex-col items-center justify-center pl-0.5"
              >
                <div class="bg-white" />
              </div>
              <div
                class="inline-flex items-start justify-between p-5 w-full"
              >
                <div
                  class="flex space-x-2 items-center justify-start"
                >
                  <div
                    class="inline-flex flex-col items-start justify-start"
                  >
                    <p
                      class="text-base font-medium leading-normal text-gray-400"
                    >
                      AMA CPT Procedure Code Patient Sex
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Label color="tertiary">Observing</Label>
                  <button class="p-1 rounded-full">
                    <i-ph-caret-down-bold class="w-5 h-5 text-cool-gray-900" />
                  </button>
                </div>
              </div>
              <div
                class="flex flex-col items-center justify-center pl-0.5"
              >
                <div class="bg-white" />
              </div>
            </div>
            <div
              class="inline-flex items-start justify-start bg-white rounded-bl-lg rounded-br-lg  w-full"
            >
              <div class="flex items-center justify-between p-5 w-full">
                <div
                  class="flex space-x-2 items-center justify-start"
                >
                  <div
                    class="inline-flex flex-col items-start justify-start"
                  >
                    <p
                      class="text-base font-medium leading-normal text-gray-400"
                    >
                      Coverage
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Label color="tertiary">Observing</Label>
                  <button class="p-1 rounded-full">
                    <i-ph-caret-down-bold class="w-5 h-5 text-cool-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          </section>
          <footer class="pb-16" />
        </div>
      </aside>
    </transition>
  </div>
</template>
