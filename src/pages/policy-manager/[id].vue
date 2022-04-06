<script setup lang="ts">
import type { Policy } from '../../stores/dbPolicies'
import { usePoliciesDb } from '../../stores/dbPolicies'
import NameEditor from '~/components/policy-manager/NameEditor.vue'

const props = defineProps<{
  id: string
}>()

const policiesDb = usePoliciesDb()

const loading = ref(true)
const policy = ref({} as Policy)
// const policy = ref({
//   id: '1742aa27-a982-46ee-a9c8-b223377967f3',
//   policy_id: 1,
//   policy_name: 'FL MCD —  Hearing Services',
//   description: 'This Rialtic Policy halts overpayments for hearing aid services that exceed frequency and/or age requirements. Services covered included BAHA, hearing aids, hearing aid molds, hearing aid repairs, and assessments. Newborn screening services are handled in a different engine.',
//   policy_topic: 'Otolaryngology',
//   effective_date_start: '1900-01-01',
//   effective_date_end: '9999-12-31',
//   edit_type: 'Units/Frequency\nCoverage\nNon-Coverage\nAge',
//   is_deleted: null,
//   version: null,
//   topic: 'Otolaryngology',
//   edit_types: [
//     {
//       id: 'covered_service',
//       name: 'Covered Service',
//     },
//     {
//       id: 'units_or_frequency',
//       name: 'Units/Frequency',
//     },
//     {
//       id: 'noncovered_service',
//       name: 'Non-Covered Service',
//     },
//   ],
// } as Policy)

watch(() => props.id, async(latestId) => {
  policy.value = await policiesDb.get(latestId)
  loading.value = false
}, {
  immediate: true,
})

const topicEditorOpen = ref(false)
const effectiveDatesEditorOpen = ref(false)
const editTypesEditorOpen = ref(false)
const descriptionEditorOpen = ref(false)
const nameEditorOpen = ref(false)

const state = reactive({
  errorMessage: '',
  updateSuccess: refAutoReset(false, 3000),
})

const updatePolicy = async(updates: Partial<Policy>) => {
  try {
    await policiesDb.update(updates, props.id)
    state.updateSuccess = true
  }
  catch (ex) {
    policy.value = await policiesDb.get(props.id)

    state.errorMessage = ex instanceof Error ? ex.message : 'Update failed'
  }
}

const saveDescription = async(description: string) => {
  policy.value = {
    ...policy.value,
    description,
  }

  descriptionEditorOpen.value = false
  updatePolicy({ description })
}

const saveEditTypes = async(editTypes: any) => {
  policy.value = {
    ...policy.value,
    edit_types: editTypes,
  }
  editTypesEditorOpen.value = false

  try {
    await policiesDb.updatePolicyEditTypes(editTypes, props.id)
    state.updateSuccess = true
  }
  catch (ex) {
    policy.value = await policiesDb.get(props.id)

    state.errorMessage = ex instanceof Error ? ex.message : 'Update failed'
  }
}

interface EffectiveDates {
  effective_date_end: string
  effective_date_start: string
}
const saveEffectiveDates = ({ effective_date_end, effective_date_start }: EffectiveDates) => {
  policy.value = {
    ...policy.value,
    effective_date_end,
    effective_date_start,
  }
  effectiveDatesEditorOpen.value = false
  updatePolicy({ effective_date_end, effective_date_start })
}

const saveName = (name: string) => {
  policy.value = {
    ...policy.value,
    policy_name: name,
  }
  nameEditorOpen.value = false
  updatePolicy({ policy_name: name })
}

const saveTopic = (topic: string) => {
  policy.value = {
    ...policy.value,
    topic,
  }
  topicEditorOpen.value = false
  updatePolicy({ topic })
}
</script>

<template>
  <header class="sticky top-0 relative bg-white z-1">
    <div class="p-4 pb-2 flex space-x-4 items-center">
      <RouterLink class="rounded-full p-1" to="/policy-manager">
        <i-ph-arrow-left-bold />
      </RouterLink>

      <Tooltip>
        <template #activator>
          <button class="flex space-x-2 rounded" @click="nameEditorOpen = true">
            <h1
              class="text-xl truncate max-w-sm" :class="{
                'rounded bg-slate-200 animate-pulse w-90 h-6': !policy.policy_name
              }"
            >
              {{ policy.policy_name }}
            </h1>

            <div class="rounded-full p-1">
              <i-heroicons-outline-pencil class="w-4 h-4" />
            </div>
          </button>
        </template>
        <div class="p-2">
          <span class="text-xs leading-none">{{ policy.policy_name }}</span>
        </div>
      </Tooltip>
    </div>

    <div class="pl-14 pr-4 pb-2 flex space-x-2">
      <button class="flex space-x-1 items-center justify-center h-full px-3 py-2 bg-white border rounded-full border-gray-300" @click="topicEditorOpen = true">
        <p class="text-xs leading-none text-center text-gray-500">
          Policy Topic
        </p>
        <p class="text-xs font-medium leading-none text-center text-gray-800">
          {{ policy.topic }}
        </p>
      </button>

      <button class="flex space-x-1 items-center justify-center h-full px-3 py-2 bg-white border rounded-full border-gray-300" @click="effectiveDatesEditorOpen = true">
        <p class="text-xs leading-none text-center text-gray-500">
          Effective Dates
        </p>
        <p class="text-xs font-medium leading-none text-center text-gray-800">
          {{ policy.effective_date_start }} to {{ policy.effective_date_end }}
        </p>
      </button>

      <Tooltip :disabled="!policy.edit_types || policy.edit_types.length <= 1">
        <template #activator>
          <button class="flex space-x-1 items-center justify-center h-full px-3 py-2 bg-white border rounded-full border-gray-300" @click="editTypesEditorOpen = true">
            <p class="text-xs leading-none text-center text-gray-500">
              Edit Types
            </p>
            <p v-if="policy.edit_types" class="text-xs font-medium leading-none text-center text-gray-800">
              {{ policy.edit_types[0].name }} <span v-if="policy.edit_types.length > 1">+{{ policy.edit_types.length - 1 }}</span>
            </p>
          </button>
        </template>
        <div v-if="policy.edit_types" class="p-2">
          <p v-for="editType in policy.edit_types" :key="editType.id" class="text-xs">
            {{ editType.name }}
          </p>
        </div>
      </Tooltip>
    </div>

    <div v-if="state.errorMessage" class="flex justify-between px-4 py-2 bg-red-300 text-red-700">
      <p>{{ state.errorMessage }}</p>

      <button class="py-1 rounded-full" @click="state.errorMessage = ''">
        <i-ph-x-bold />
      </button>
    </div>

    <transition enter-from-class="opacity-0 -translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-10">
      <div v-if="state.updateSuccess" class="absolute top-4 right-4 pl-4 py-2 pr-6 flex space-x-4 items-center rounded-lg border border-2 shadow-lg border-green-200 bg-green-100 text-green-700 transition transform-gpu cursor-pointer" @click="state.updateSuccess = false">
        <i-ph-check-bold />
        <div>Successfully updated</div>
      </div>
    </transition>

    <div class="absolute bottom-0 h-px bg-gray-300 w-full " />
  </header>

  <NameEditor v-model="nameEditorOpen" :name="policy.policy_name" @save="saveName" />
  <TopicEditor v-model="topicEditorOpen" :topic="policy.topic" @save="saveTopic" />
  <EditTypeEditor v-model="editTypesEditorOpen" :edit-types="policy.edit_types" @save="saveEditTypes" />
  <EffectiveDatesEditor v-model="effectiveDatesEditorOpen" :end="policy.effective_date_end" :start="policy.effective_date_start" @save="saveEffectiveDates" />
  <DescriptionEditor v-model="descriptionEditorOpen" :editor-content="policy.description" @save="saveDescription" />

  <main class="p-4 bg-white">
    <div class="grid gap-4 grid-cols-3">
      <section class="card">
        <div class="prose">
          <RichTextBlock :content="policy.description" :loading="loading" title="Description">
            <template #footer>
              <div class="flex px-5 py-2">
                <button class="btn" @click="descriptionEditorOpen = true">
                  Edit
                </button>
              </div>
            </template>
          </RichTextBlock>
        </div>
      </section>
    </div>
    <RouterView />
  </main>
</template>

<route lang="yaml">
meta:
  layout: bare
  requiresAuth: true
</route>
