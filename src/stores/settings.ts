import { acceptHMRUpdate, defineStore } from 'pinia'

export const enum TimeFrameIds {
  days_7 = '7_days',
  days_30 = '30_days',
  days_90 = '90_days',
  q_to_date = 'q_to_date',
  y_to_date = 'y_to_date',
  start = 'start',
//   custom = 'custom',
}

export interface TimeFrameItem {
  label: string
  multiple: number
  rateChange: number
  value: TimeFrameIds
}

export const timeFrameItems: Record<TimeFrameIds, TimeFrameItem> = {
  '7_days': { label: 'Last 7 days', multiple: 0.07, rateChange: 1.2, value: TimeFrameIds.days_7 },
  '30_days': { label: 'Last 30 days', multiple: 0.3333, rateChange: 1.15, value: TimeFrameIds.days_30 },
  '90_days': { label: 'Last 90 days', multiple: 1, rateChange: 1, value: TimeFrameIds.days_90 },
  'q_to_date': { label: 'Quarter to date', multiple: 0.8, rateChange: 0.9, value: TimeFrameIds.q_to_date },
  'y_to_date': { label: 'Year to date', multiple: 1.4, rateChange: 0.87, value: TimeFrameIds.y_to_date },
  'start': { label: 'Since inception', multiple: 7.43, rateChange: 0.8, value: TimeFrameIds.start },
//   'custom': { label: 'Custom', multiple: 8.43, rateChange: 0.85, value: TimeFrameIds.custom },
}

export interface LineOfBusinessItem extends Record<string, any> {
  label: string
  value: number
  statsId: number
}

export const useSettingsStore = defineStore('settings', () => {
  const activeConnector = useStorage('rialtic/settings:activeConnector', {} as LineOfBusinessItem)
  const activeTimeFrame = useStorage('rialtic/settings:activeTimeFrame', TimeFrameIds.days_30)

  return {
    activeConnector,
    activeTimeFrame,
    getTimeFrame: (id: string) => timeFrameItems[id as TimeFrameIds],
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
