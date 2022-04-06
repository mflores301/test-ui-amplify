<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder: string
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const search = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    emit('update:modelValue', val)
  },
})

const clear = () => {
  search.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative flex items-center justify-between flex-1 text-gray-600 w-full rounded-full">
    <div class="absolute pointer-events-none z-2">
      <i-ph-magnifying-glass class="w-4 transform translate-x-2" />
    </div>

    <input
      v-model="search"
      aria-label="Search policies"
      class="sibling px-7 py-2 text-xs bg-transparent text-sm leading-4 rounded-full w-full border border-gray-300 focus:outline-transparent focus:ring focus:border-primary z-1"
      :placeholder="placeholder"
      type="search"
    >
    <div
      class="absolute h-full w-full flex flex-col justify-end overflow-hidden rounded-full transform bg-white pointer-events-none"
    >
      <transition
        enter-from-class="translate-y-1"
        enter-to-class="translate-y-0"
        enter-active-class="transform"
        leave-active-class="transform"
        leave-to-class="translate-y-1"
        leave-from-class="translate-y-0"
      >
        <div
          v-if="loading"
          class="h-3px w-full -z-1 transition-transform animate-pulse bg-primary-light-hover"
        >
          <div class="bar-value bg-primary-light w-full h-full rounded" />
        </div>
      </transition>
    </div>
    <button
      v-if="search"
      class="absolute right-2 transform -translate-x-0 z-2"
      :class="search ? [] : ['pointer-events-none']"
      :disabled="!search"
      @click="clear()"
    >
      <i-ph-x v-if="search" class="w-4" />
    </button>
  </div>
</template>

<style scoped>
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  display: none;
  opacity: 0;
  pointer-events: none;
}

input::placeholder {
  @apply text-xs;
}

.bar-value {
  animation: indeterminateAnimation 1s infinite linear;
  transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
  0% {
    transform: translateX(0) scaleX(0);
  }
  24% {
    transform: translateX(0) scaleX(0.24);
  }
  62% {
    transform: translateX(38%) scaleX(0.62);
  }
  100% {
    transform: translateX(100%) scaleX(0.62);
  }
}
</style>
