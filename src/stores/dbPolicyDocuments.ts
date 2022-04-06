import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'
import { sortAlpha } from '~/utils/sort'

import type { EditType } from '~/stores/dbEditTypes'

export interface Policy {
  id: string
  // client: string
  is_primary?: boolean
  description: string
  // defense_policy_excerpt: string
  edit_type: string
  edit_types: Omit<EditType, 'active'>[]
  effective_date_end: string
  effective_date_start: string
  // engine_scopw_description: string
  is_deleted?: boolean | null
  // region: string
  name?: string
  policy_id: number
  policy_name: string
  policy_topic: string
  // procedure_codes: string
  source: string
  source_type_level_1?: string
  source_type_level_2?: string
  // subdomain: string
  topic: string
  version: number | null
}
export interface PolicyItem {
  id: number | string
  status: 'active' | 'observing' | 'inactive'
  name: string
  insightRate: number
  savings: number | string
}

const enum DB {
  name = 'policy_documents',
  policyEditTypes = 'policy_edit_types',
}

export const usePolicyDocuments = defineStore('dbPolicyDocuments', () => {
  const loading = ref(false)

  const policies = useStorage('@rialtic/console:policies', [] as Policy[])

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

  const getAll = async(policy_id: string) => {
    loading.value = true
    const { data, error } = await supabase.from(DB.name)
      .select('*', { count: 'exact' })
      .eq('policy_id', policy_id)
      .order('is_primary', { ascending: false })

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
      //   getAll()
      throw error
    }
  }

  const update = async(dbUpdates: Partial<Policy>, id: string) => {
    policies.value = sortAlpha(policies.value.map(item => item.id === id ? { ...item, ...dbUpdates } : item), 'name')
    const { error } = await supabase.from(DB.name).update(dbUpdates).eq('id', id)

    if (error) {
      console.error(error, error?.message)
      //   await getAll()
      throw new Error(error.message)
    }
  }

  //   const updatePolicyEditTypes = async(editTypes: EditType[], id: string) => {
  //     policies.value = sortAlpha(policies.value.map(item => item.id === id ? { ...item, edit_types: editTypes } : item), 'name')

  //     const { error } = await supabase.from(DB.policyEditTypes).delete().match({ policy_id: id })

  //     const policyEditTypes = editTypes.map(editType => ({ policy_id: id, edit_type: editType.id }))

  //     const { error: ex } = await supabase.from(DB.policyEditTypes).insert(policyEditTypes)

  //     if (error || ex) {
  //       const err = error || ex
  //       console.error(err, err?.message)
  //       await getAll()
  //       throw new Error(err!.message)
  //     }
  //   }

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

  //   onMounted(() => {
  //     getAll()
  //   })

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
    // updatePolicyEditTypes,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePolicyDocuments, import.meta.hot))
