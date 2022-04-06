<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Rialtic Demo',
  meta: [
    { name: 'description', content: 'A prototype dashboard for Railtic\'s payment accuracy insights' },
  ],
})
</script>

<template>
  <router-view />
</template>
