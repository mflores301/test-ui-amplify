import { acceptHMRUpdate, defineStore } from 'pinia'
import { supabase } from '~/modules/supabase'
import { sortAlpha } from '~/utils/sort'

const enum DB {
  name = 'topics',
}
export interface EditType {
  id: number
  name: string
  active: boolean
}

export const useTopics = defineStore('dbTopics', () => {
  const loading = ref(false)

  const editTypes = useStorage('@rialtic/demo:topics', [] as EditType[])

  const active = computed(() => editTypes.value.filter(({ active }) => active))

  const add = async(item: Partial<EditType>) => {
    const { data, error } = await supabase.from(DB.name).insert([item])

    if (error)
      console.error(error)

    editTypes.value = sortAlpha([...editTypes.value, ...data as EditType[] || []], 'name')
  }

  const getAll = async() => {
    const { data, error } = await supabase.from(DB.name)
      .select('*')
      .order('name', { ascending: true })

    if (error)
      console.error(error)

    editTypes.value = (data || []) as EditType[]
  }

  const deleteItem = async(id: number) => {
    editTypes.value = editTypes.value.filter(item => item.id !== id)

    const { error } = await supabase.from(DB.name).delete().eq('id', id)

    if (error) {
      console.error(error)
      getAll()
    }
  }

  const update = async(dbUpdates: Partial<EditType>, id: number) => {
    editTypes.value = sortAlpha(editTypes.value.map(item => item.id === id ? { ...item, ...dbUpdates } : item), 'name')
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
    all: editTypes,
    delete: deleteItem,
    loading,
    update,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTopics, import.meta.hot))
