import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'
import { sortAlpha } from '~/utils/sort'

export interface Policy {
  id: string
  client: string
  description: string
  defense_policy_excerpt: string
  engine_scopw_description: string
  is_deleted?: boolean
  region: string
  name: string
  procedure_codes: string
  source: string
  subdomain: string
  topic: string
}
export interface PolicyItem {
  id: number | string
  status: 'active' | 'observing' | 'inactive'
  name: string
  insightRate: number
  savings: number | string
}

const enum DB {
  name = 'policies',
}

export const usePolicies = defineStore('demoPolicies', () => {
  const loading = ref(false)

  const policies = ref([] as Policy[])

  const active = computed(() => policies.value.filter(({ is_deleted }) => !is_deleted))

  const add = async(item: Partial<Policy>) => {
    const { data, error } = await supabase.from(DB.name).insert([item])

    if (error)
      console.error(error)

    policies.value = sortAlpha([...policies.value, ...data as Policy[] || []], 'name')
  }

  const get = async(id: string) => {
    const { data, error } = await supabase.from(DB.name)
      .select('*')
      .eq('id', id)
      .limit(1)
      .single()

    if (error)
      console.error(error)

    return data as Policy
  }

  const getAll = async() => {
    loading.value = true
    const { data, error } = await supabase.from(DB.name)
      .select('*')
      .order('name', { ascending: true })

    if (error)
      console.error(error)

    policies.value = (data || []) as Policy[]
    loading.value = false
  }

  const deleteItem = async(id: string) => {
    policies.value = policies.value.filter(item => item.id !== id)

    const { error } = await supabase.from(DB.name).delete().eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  const update = async(dbUpdates: Partial<Policy>, id: string) => {
    policies.value = sortAlpha(policies.value.map(item => item.id === id ? { ...item, ...dbUpdates } : item), 'name')
    const { error } = await supabase.from(DB.name).update(dbUpdates).eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  const search = async(text: string) => {
    loading.value = true
    const { data, error } = await supabase.from(DB.name)
      .select('*')
      .order('name', { ascending: true })
      .textSearch('name', text)

    if (error)
      console.error(error)

    policies.value = (data || []) as Policy[]
    loading.value = false
  }

  onMounted(() => {
    getAll()
  })

  return {
    active,
    add,
    all: policies,
    get,
    getAll,
    delete: deleteItem,
    loading,
    search,
    update,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePolicies, import.meta.hot))
