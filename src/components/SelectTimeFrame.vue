<script setup lang="ts">
import type { Placement } from '@floating-ui/dom'
import type { TimeFrameItem } from '~/stores/settings'
import { TimeFrameIds, timeFrameItems, useSettingsStore } from '~/stores/settings'

const settings = useSettingsStore()

defineProps<{
  placement: Placement
}>()

const items = computed(() => Object.values(timeFrameItems) as TimeFrameItem[])

const value = computed({
  get() {
    return timeFrameItems[settings.activeTimeFrame as TimeFrameIds || TimeFrameIds.days_30]
  },
  set(item: TimeFrameItem) {
    settings.activeTimeFrame = item.value
  },
})
</script>

<template>
  <Dropdown v-model="value" :items="items" :placement="placement" />
</template>
