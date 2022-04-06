<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const demoFirstName = useStorage('@rialitc/demo_first-name', 'Eva')

const auth = useAuthStore()
</script>

<template>
  <main class="p-4">
    <div class="container mx-auto">
      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
        <div v-if="!auth.isAuthed" class="card flex col-span-4 flex-col sm:flex-row sm:justify-between p-4 group border border-2 border-transparent transition-colors">
          <div class="pb-4">
            <h2 class="text-lg font-semibold mb-2 text-gray-700">
              <i-ph-sign-in-bold class="inline pr-1" />

              Sign in
            </h2>
            <p class="flex-1 text-sm text-left">
              Sign in to customize demo data
            </p>
          </div>

          <div class="flex justify-end">
            <button class="btn w-full sm:w-auto flex items-center h-10 bg-white text-gray-700 border border-gray-700 hover:text-white" @click="auth.signIn()">
              <i-ph-google-logo-bold class="inline mr-2" />
              <span class="text-center w-full sm:text-left">Sign in with Google</span>
            </button>
          </div>
        </div>
        <div class="card flex flex-col p-4 group border border-2 border-transparent transition-colors">
          <h2 class="text-lg font-semibold mb-2 text-gray-700">
            <i-ph-rocket-launch-bold class="inline mr-1" />

            Demo
          </h2>
          <p class="text-sm text-left">
            Dashboard demo for the payments accuracy UI
          </p>
          <div class="flex-1 py-6">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              <div class="pb-1">First name</div>
              <input
                v-model="demoFirstName"
                type="text"
                class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-primary-light focus:border-primary-light"
              >
            </label>
          </div>
          <div class="flex justify-end">
            <RouterLink class="btn group-hover:shadow-md" to="/dashboard">
              Enter
            </RouterLink>
          </div>
        </div>

        <div v-if="auth.isAuthed" class="card p-4 flex flex-col">
          <h2 class="text-lg font-semibold mb-2 text-gray-700">
            <i-ph-gear-six-bold class="inline pr-1" />
            Demo settings
          </h2>
          <div class="flex-1">
            <p class="text-sm text-left">
              Customize the data for the payments accuracy demo
            </p>
          </div>
          <div class="flex justify-end">
            <RouterLink class="btn group-hover:shadow-md" to="/demo-settings">
              Customize
            </RouterLink>
          </div>
        </div>

        <div v-if="auth.isAuthed" class="card p-4 flex flex-col">
          <h2 class="text-lg font-semibold mb-2 text-gray-700">
            <i-ph-books class="inline pr-1" />
            Policy Manager
          </h2>
          <div class="flex-1">
            <p class="text-sm text-left">
              Manage Rialtic Policies
            </p>
          </div>
          <div class="flex justify-end">
            <RouterLink class="btn group-hover:shadow-md" to="/policy-manager">
              Enter
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
