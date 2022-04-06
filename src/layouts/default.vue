<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

const appLayout = ref(null)
const isOpen = ref(true)

// onBeforeMount(() => {
useResizeObserver(appLayout, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect

  if (width < breakpointsTailwind.lg)
    isOpen.value = false
})

const { y } = useScroll(document)
const hasScrolled = computed(() => y.value > 0)

const appToolbar = ref(null)
const { height: toolbarHeight } = useElementSize(appToolbar)

provide('toolbarHeight', toolbarHeight)

</script>

<template>
  <div ref="appTarget" class="min-h-screen w-full flex">
    <AppNavDrawer v-model="isOpen" />
    <div class="relative w-full lg:w-auto flex-1">
      <AppToolbar ref="appToolbar" class="sticky top-0" :class="hasScrolled ? ['shadow'] : []">
        <button class="rounded-full h-8 w-8 lg:hidden" @click="isOpen = !isOpen">
          <i-ph-list class="w-6 h-6" />
        </button>
      </AppToolbar>

      <router-view />
    </div>
  </div>
</template>
