<script setup lang="ts">
import { useLinesOfBusiness } from '~/stores/dbLinesOfBusiness'
import type { LineOfBusinessItem } from '~/stores/settings'
import { useSettingsStore } from '~/stores/settings'

const linesOfBusiness = useLinesOfBusiness()
const settings = useSettingsStore()

const lineOfBusinessItems = computed(() => linesOfBusiness.active.map(item => ({ label: item.name, value: item.id, statsId: item.stats })))

const value = computed({
  get() {
    return settings.activeConnector as LineOfBusinessItem || lineOfBusinessItems.value[0]
  },
  set(item: LineOfBusinessItem) {
    settings.activeConnector = item
  },
})

/** Handle edge case of resetting localStorage */
const sub = watch([lineOfBusinessItems, () => settings.activeConnector as LineOfBusinessItem], ([lines, activeLoB]) => {
  if (!activeLoB.statsId && lines.length) {
    settings.activeConnector = lines[0]
    sub()
  }
})
</script>

<template>
  <Dropdown v-model="value" :items="lineOfBusinessItems" />
</template>
