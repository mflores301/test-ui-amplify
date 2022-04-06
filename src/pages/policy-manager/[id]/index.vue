<script setup lang="ts">
import { usePolicyDocuments } from '~/stores/dbPolicyDocuments'

const props = defineProps<{
  id: string
}>()

const policyDocs = usePolicyDocuments()

watch(() => props.id, (id) => {
  policyDocs.getAll(id)
}, {
  immediate: true,
})
</script>

<template>
  <div class="py-6">
    <h2 class="text-lg font-semibold w-full border-b">
      Associated documents
    </h2>
    <table class="my-4">
      <thead>
        <th align="left" class="px-2">
          Is Primary
        </th>
        <th align="left" class="px-2">
          Source
        </th>
        <th align="left" class="px-2">
          Source type level 1
        </th>
        <th align="left" class="px-2">
          Source type level 2
        </th>
        <th class="px-2">
          Effective date start
        </th>
        <th class="px-2">
          Effective date end
        </th>
      </thead>

      <tbody>
        <tr v-for="doc in policyDocs.all" :key="doc.id">
          <td class="px-2 py-1">
            <Label v-if="doc.is_primary" color="primary">Primary</Label>
          </td>
          <td class="px-2 py-1">
            {{ doc.source }}
          </td>
          <td class="px-2 py-1">
            {{ doc.source_type_level_1 }}
          </td>
          <td class="px-2 py-1">
            {{ doc.source_type_level_2 }}
          </td>
          <td class="px-2 py-1">
            {{ doc.effective_date_start }}
          </td>
          <td class="px-2 py-1">
            {{ doc.effective_date_end }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <hr> -->
  <!-- <pre>{{ policyDocs.all }}</pre> -->
</template>
