<script setup lang="ts">
import type { ProcedureType } from '~/stores/dbProcedureTypes'
import { useProcedureTypes } from '~/stores/dbProcedureTypes'

const procedureTypes = useProcedureTypes()

const dialogOpen = ref(false)
const formName = ref('')

const editId = ref(null as number | null)

const edit = (id: number, name: string) => {
  formName.value = name
  editId.value = id

  dialogOpen.value = true
}

const save = async(item: Partial<ProcedureType>) => {
  if (editId.value) {
    await procedureTypes.update({ name: item.name! }, editId.value)
    editId.value = null
  }
  else { await procedureTypes.add(item) }

  formName.value = ''
  dialogOpen.value = false
}

</script>

<template>
  <section class="card">
    <header class="flex p-4 items-center justify-between">
      <h2 class="font-semibold text-lg text-gray-600 tracking-wide">
        Procedure types
      </h2>

      <button class="btn" @click="editId = null; dialogOpen = true">
        Create
      </button>
      <Dialog v-model="dialogOpen" class="max-w-sm">
        <header class="p-4">
          <span class="text-gray-600">
            {{ editId != null ? 'Rename Procedure type' : 'Create new Procedure type' }}
          </span>
        </header>
        <div class="px-4">
          <div class="flex-1">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">Procedure type</div>
              <input
                v-model.trim="formName"
                type="text"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>
          </div>
        </div>
        <footer class="flex justify-end space-x-4 p-4">
          <button class="" @click="dialogOpen = false">
            Cancel
          </button>
          <button class="btn" @click="save({ name: formName })">
            Save
          </button>
        </footer>
      </Dialog>
    </header>

    <ul class="py-4">
      <li v-for="{ id, active, name } in procedureTypes.all" :key="id" class="px-4 py-2 flex justify-between">
        <div>
          {{ name }}
          <span v-if="!active" class="mx-2 text-xs rounded bg-gray-300 px-2">Inactive</span>
        </div>

        <div class="flex items-center space-x-2 text-gray-600">
          <button class="p-1" @click="procedureTypes.update({ active: !active }, id)">
            <i-ph-eye v-if="active" />
            <i-ph-eye-slash v-else />
          </button>
          <button class="p-1" @click="edit(id, name)">
            <i-ph-pencil />
          </button>
          <button class="p-1" @click="procedureTypes.delete(id)">
            <i-ph-trash />
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
