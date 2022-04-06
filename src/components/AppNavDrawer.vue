<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isMini = ref(false)
const toggleMini = useToggle(isMini)

useRouter().afterEach((to, from) => {
  emit('update:modelValue', false)
})

const target = ref(null)
onClickOutside(target, () => {
  emit('update:modelValue', false)
})

</script>

<template>
  <div
    class="w-0 lg:w-64"
    :class="{
      'md:max-w-64': !isMini,
      'md:max-w-18': isMini
    }"
  >
    <aside
      ref="target"
      class="fixed w-64 h-full top-0 left-0 bg-primary shadow z-30 transition transform-gpu translate-x-0 lg:transform-none"
      :class="{
        '-translate-x-64': !modelValue,
        'md:max-w-64': !isMini,
        'md:max-w-18': isMini
      }"
    >
      <div
        class="inline-flex flex-col space-y-8 items-start justify-start px-3 py-2 w-full overflow-hidden"
      >
        <div class="inline-flex space-x-3 items-end justify-end w-3/4 h-12 pl-1.5 pr-3 pt-8">
          <RouterLink
            class="w-full transition-transform inline-block transform"
            :class="{ '-translate-x-[6px] scale-90': isMini }"
            to="/"
          >
            <RialticLogo :icon="isMini" />
          </RouterLink>
        </div>
        <ul class="text-gray-300 flex flex-col space-y-4 items-start justify-start w-full">
          <li class="w-full">
            <AppNavDrawerItem to="/dashboard">
              <template #icon>
                <i-ph-chart-bar class="w-6 h-full" />
              </template>
              Dashboard
            </AppNavDrawerItem>
          </li>
          <li class="w-full">
            <AppNavDrawerItemDisabled to="/insight-explorer">
              <template #icon>
                <i-ph-lightbulb class="w-6 h-full" />
              </template>
              Insights
            </AppNavDrawerItemDisabled>
          </li>
          <li class="w-full">
            <AppNavDrawerItem to="/policy-explorer">
              <template #icon>
                <i-ph-books class="w-6 h-full" />
              </template>
              Policies
            </AppNavDrawerItem>
          </li>
          <li class="w-full">
            <AppNavDrawerItem to="/claim-explorer">
              <template #icon>
                <i-ph-file-text class="w-6 h-full" />
              </template>
              Claims
            </AppNavDrawerItem>
          </li>
          <li class="w-full">
            <AppNavDrawerItemDisabled to="/provider-explorer">
              <template #icon>
                <i-ph-heartbeat class="w-6 h-full" />
              </template>
              Providers
            </AppNavDrawerItemDisabled>
          </li>
        </ul>
      </div>
      <footer
        class="hidden lg:block fixed py-2 px-3 bottom-0 left-0 w-64 bg-primary transition"
        :class="{ 'max-w-18': isMini, 'max-w-64': !isMini }"
      >
        <button
          class="p-2 rounded-full text-white transition-transform transform-gpu"
          :class="{ 'translate-x-1 rotate-180': isMini, 'translate-x-46 rotate-0': !isMini }"

          @click="toggleMini()"
        >
          <i-ph-caret-left-bold
            class="w-5 h-5"
          />
        </button>
      </footer>
    </aside>
  </div>
</template>

<style scoped>
aside,
footer {
  transition-property: translate, max-width;
}
</style>
