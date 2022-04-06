
<script setup lang="ts">
const menuEl = ref(null)
const menuOpen = ref(false)

onClickOutside(menuEl, () => {
  menuOpen.value = false
})

</script>

<template>
  <header id="appToolbar" class="w-full min-h-16 bg-white z-20">
    <div class="px-4 lg:px-8 py-2 h-16 border-b">
      <div class="inline-flex flex-1 items-center justify-between w-full h-full">
        <div class="flex items-center h-full">
          <slot />

          <div class="flex space-x-2">
            <SelectLineOfBusiness />
            <SelectTimeFrame
              :footer="[{ label: 'Custom Range', value: 'custom' }]"
              placement="bottom-start"
            />
          </div>
        </div>
        <div class="flex space-x-6 items-center justify-center">
          <button class="text-gray-500">
            <i-ph-clock class="w-6 h-6" />
          </button>
          <button ref="menuEl" class="relative flex p-2 py-1 border items-center rounded-lg border-gray-200" @click="menuOpen = !menuOpen">
            <!-- <LogoAdaptive class="h-5 w-20 mr-3" /> -->

            <div class="relative w-9 h-9 rounded-full bg-gray-200 flex justify-center items-center overflow-hidden">
              <!-- <img
                class="absolute inset-0"
                :src="user.picture"
              /> -->
              <div class="flex p-1 justify-center">
                <i-ph-user class="block h-6 w-6 text-gray-500" />
              </div>
            </div>
            <div v-if="menuOpen" class="absolute card w-40 top-12 right-0">
              <ul class="flex flex-col p-2">
                <li>
                  <RouterLink class="user-menu-link" active-class="bg-primary-light text-white" to="/settings">
                    Settings
                  </RouterLink>
                </li>
                <li>
                  <button class="user-menu-link">
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div id="toolbarActions" />
  </header>
</template>

<style scoped>
.user-menu-link {
    @apply inline-flex w-full px-4 py-2 text-left font-light text-sm rounded-lg hover:bg-primary-light hover:text-white;
}
</style>
