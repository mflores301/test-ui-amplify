import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'

const enum DB {
  name = 'demo_stats',
}
export interface DemoStats {
  id: number
  label: string
  created: string
  claimsVolume: number
  claimsTotal: number
  insightsActive: number
  insightsObserving: number
  savingsActive: number
  savingsObserving: number
}

export const useDemoStats = defineStore('dbDemoStats', () => {
  const loading = ref(false)

  const demoStats = ref([] as DemoStats[])

  const add = async(item: Partial<DemoStats>) => {
    const { data, error } = await supabase.from(DB.name)
      .insert([item])

    if (error)
      console.error(error)

    demoStats.value = [...demoStats.value, ...data as DemoStats[] || []]
  }

  const getAll = async() => {
    const { data, error } = await supabase.from(DB.name)

      .select('*')

    if (error)
      console.error(error)

    demoStats.value = (data || []) as DemoStats[]
  }

  const getById = async(id: number) => {
    const { data, error } = await supabase.from(DB.name)
      .select('*')
      .eq('id', id)

    if (error)
      console.error(error)

    return (data && data.length ? data[0] : {}) as DemoStats
  }

  const deleteItem = async(id: number) => {
    demoStats.value = demoStats.value.filter(item => item.id !== id)

    const { error } = await supabase.from(DB.name).delete().eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  const update = async(dbUpdates: Partial<DemoStats>, id: number) => {
    demoStats.value = demoStats.value.map(item => item.id === id ? { ...item, ...dbUpdates } : item)
    const { error } = await supabase.from(DB.name).update(dbUpdates).eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  onMounted(() => {
    getAll()
  })

  return {
    add,
    all: demoStats,
    delete: deleteItem,
    getById,
    loading,
    update,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDemoStats, import.meta.hot))
