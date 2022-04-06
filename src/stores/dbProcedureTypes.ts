import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'
import { sortAlpha } from '~/utils/sort'

const enum DB {
  name = 'procedure_types',
}
export interface ProcedureType {
  id: number
  name: string
  active: boolean
  created: string
}

export const useProcedureTypes = defineStore('dbProcedureTypes', () => {
  const loading = ref(false)

  const procedureTypes = useStorage('@rialtic/demo:procedure_types', [] as ProcedureType[])

  const active = computed(() => procedureTypes.value.filter(({ active }) => active))

  const add = async(item: Partial<ProcedureType>) => {
    const { data, error } = await supabase.from(DB.name).insert([item])

    if (error)
      console.error(error)

    procedureTypes.value = sortAlpha([...procedureTypes.value, ...data as ProcedureType[] || []], 'name')
  }

  const getAll = async() => {
    const { data, error } = await supabase.from(DB.name)
      .select('*')
      .order('name', { ascending: true })

    if (error)
      console.error(error)

    procedureTypes.value = (data || []) as ProcedureType[]
  }

  const deleteItem = async(id: number) => {
    procedureTypes.value = procedureTypes.value.filter(item => item.id !== id)

    const { error } = await supabase.from(DB.name).delete().eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  const update = async(dbUpdates: Partial<ProcedureType>, id: number) => {
    procedureTypes.value = sortAlpha(procedureTypes.value.map(item => item.id === id ? { ...item, ...dbUpdates } : item), 'name')
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
    active,
    add,
    all: procedureTypes,
    delete: deleteItem,
    loading,
    update,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useProcedureTypes, import.meta.hot))
