<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const menu = ref(null)
const menuOpen = ref(false)

onClickOutside(menu, () => {
  menuOpen.value = false
})
</script>

<template>
  <div>
    <header class="flex justify-center px-4 py-2 border-b">
      <div class="container mx-auto flex justify-between">
        <RouterLink class="rounded-lg transition-colors hover:bg-gray-200" to="/">
          <img class="max-w-sm h-12" src="https://uploads-ssl.webflow.com/610059df4ac6b94048b06fe8/61005a980fe39f3024f3dbab_Rialtic%20Logo%20-%20Full%20Color-p-3200.png" alt="Rialtic">
        </RouterLink>
        <button v-show="auth.isAuthed" ref="menu" class="relative w-9" @click="menuOpen = !menuOpen">
          <div class="relative w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
            <img
              v-if="auth.userMetadata && auth.userMetadata.picture"
              class="absolute inset-0 w-full"
              :src="auth.userMetadata.picture"
            >
            <div v-else class="flex h-full justify-center items-center">
              <i-ph-user class="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div v-if="menuOpen" class="absolute card w-52 right-0">
            <div class="p-2 text-left">
              <p class="text-sm font-medium">
                {{ auth.userMetadata.name }}
              </p>
              <p class="truncate text-xs text-gray-500">
                {{ auth.userMetadata.email }}
              </p>
            </div>
            <div class="bg-gray-200 w-full h-px" />
            <ul class="flex flex-col p-2">
              <!-- <li>
                <RouterLink class="user-menu-link" active-class="bg-primary-light text-white" to="/settings">
                  Settings
                </RouterLink>
              </li> -->
              <li>
                <button class="user-menu-link" @click="auth.signOut()">
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </button>
      </div>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
.user-menu-link {
    @apply inline-flex w-full px-4 py-2 text-left font-light text-sm rounded-lg hover:bg-primary-light hover:text-white;
}
</style>
