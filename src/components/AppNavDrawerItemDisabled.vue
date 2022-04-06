<template>
  <span
    class="group transition-colors duration-200 font-normal inline-flex space-x-3 items-center justify-start w-full py-3 pl-3 pr-4 rounded-lg hover:bg-primary-hover"
  >
    <div class="w-6 h-full">
      <slot name="icon" />
    </div>
    <span
      class="text-xs tracking-wide truncate group-hover:hidden"
    >
      <slot />
    </span>
    <span class="hidden text-xs select-none tracking-wide italic truncate group-hover:inline">Coming soon</span>
  </span>
</template>
