<template>
  <a :href="url" target="_blank" class="footer-item">
    <slot />
  </a>
</template>

<script lang="ts" setup>
defineProps({
  url: { type: String, default: '' },
})
</script>

<style lang="postcss" scoped>
.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
