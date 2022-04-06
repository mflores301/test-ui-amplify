<script setup lang="ts">
import { usePoliciesDb } from '~/stores/dbPolicies'

useHead({
  title: 'Policy Manager | Rialtic demo',
})
const policiesDb = usePoliciesDb()

</script>

<template>
  <main>
    <table>
      <thead class="sticky top-0 border-b text-xs bg-white w-full">
        <th align="left" class="px-4">
          Actions
        </th>
        <th align="left" class="px-4">
          Content status
        </th>
        <th align="left" class="px-4">
          Name
        </th>
        <th align="left" class="px-4">
          Description
        </th>
        <th align="left" class="px-4">
          Topic
        </th>
        <th align="left" class="px-4">
          Effective date start
        </th>
        <th align="left" class="px-4">
          Effective date end
        </th>
        <th align="left" class="px-4">
          Edit types
        </th>
      </thead>
      <tbody class="divide-y">
        <tr v-for="policy in policiesDb.all" :key="policy.id" class="text-sm">
          <td class="px-4 py-2">
            <RouterLink class="btn" :to="`/policy-manager/${policy.id}`">
              Edit
            </RouterLink>
          </td>
          <td class="px-4 py-2">
            {{ policy.content_status }}
          </td>
          <td class="px-4 py-2">
            {{ policy.policy_name }}
          </td>
          <td class="px-4 py-2">
            {{ policy.description }}
          </td>
          <td class="px-4 py-2">
            {{ policy.topic }}
          </td>
          <td class="px-4 py-2">
            {{ policy.effective_date_start }}
          </td>
          <td class="px-4 py-2">
            {{ policy.effective_date_end }}
          </td>
          <td class="px-4 py-2">
            <p v-for="editType in policy.edit_types" :key="editType.id">
              {{ editType.name }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
