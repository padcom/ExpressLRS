<template>
  <section>
    <h2>{{ title }}</h2>
    <slot />
  </section>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: 'Section title' },
})
</script>

<style lang="postcss" scoped>
section {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  row-gap: 0.125rem;
  column-gap: 0.25rem;

  & h2 {
    grid-column: 1 / -1;
    font-weight: 600;
  }
}
</style>
