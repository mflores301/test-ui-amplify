<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const { idle } = useIdle(1000 * 60 * 15)

const tabs = [
  {
    label: 'Demo stats',
    to: '/demo-settings',
  },
  {
    label: 'Lines of business',
    to: '/demo-settings/lines-of-business',
  },
  {
    label: 'Procedure types',
    to: '/demo-settings/procedure-types',
  },
  {
    label: 'Edit types',
    to: '/demo-settings/edit-types',
  },
]

whenever(idle, () => {
  if (!auth.isAuthed)
    router.push('/')
})
</script>

<template>
  <main class="p-4">
    <div class="container mx-auto">
      <header class="flex items-center mb-4">
        <RouterLink class="p-2 mr-2 text-gray-600" to="/">
          <i-ph-arrow-left-bold />
        </RouterLink>
        <h1 class="text-2xl flex-1">
          Demo settings
        </h1>
        <RouterLink class="btn" to="/dashboard">
          View demo
        </RouterLink>
      </header>

      <div class="flex mb-4">
        <RouterLink
          v-for="{ label, to } in tabs"
          v-slot="{ isExactActive }"
          :key="to"
          exact
          :to="to"
          exact-active-class="text-primary"
          class="relative border-b-2 border-gray-200 rounded-t hover:bg-gray-200"
        >
          <div class="px-4 py-2">
            {{ label }}
          </div>
          <div v-if="isExactActive" class="absolute -bottom-2px h-2px bg-primary w-full" />
        </RouterLink>
      </div>

      <RouterView />
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
