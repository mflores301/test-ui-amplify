import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'
import { sortAlpha } from '~/utils/sort'

const enum DB {
  name = 'lines_of_business',
}
export interface LineOfBusiness {
  id: number
  name: string
  active: boolean
  created: string
  stats: number
}

export const useLinesOfBusiness = defineStore('dbLinesOfBusiness', () => {
  const loading = ref(false)

  const linesOfBusiness = useStorage('@rialtic/demo:lines_of_business', [] as LineOfBusiness[])

  const active = computed(() => linesOfBusiness.value.filter(({ active }) => active))

  const addLineOfBusiness = async(item: Partial<LineOfBusiness>) => {
    const { data, error } = await supabase.from(DB.name).insert([item])

    if (error)
      console.error(error)

    linesOfBusiness.value = sortAlpha([...linesOfBusiness.value, ...data as LineOfBusiness[] || []], 'name')
  }

  const getAll = async() => {
    const { data: lines_of_business, error } = await supabase.from(DB.name)
      .select('*')
      .order('name', { ascending: true })

    if (error)
      console.error(error)

    linesOfBusiness.value = (lines_of_business || []) as LineOfBusiness[]
  }

  const deleteItem = async(id: number) => {
    linesOfBusiness.value = linesOfBusiness.value.filter(item => item.id !== id)

    const { error } = await supabase.from(DB.name).delete().eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  const update = async(dbUpdates: Partial<LineOfBusiness>, id: number) => {
    linesOfBusiness.value = sortAlpha(linesOfBusiness.value.map(item => item.id === id ? { ...item, ...dbUpdates } : item), 'name')
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
    add: addLineOfBusiness,
    all: linesOfBusiness,
    delete: deleteItem,
    loading,
    update,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLinesOfBusiness, import.meta.hot))
