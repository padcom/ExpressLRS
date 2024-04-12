<template>
  <span class="tag" :style="{ backgroundColor: bg, color: fg }">
    <slot />
  </span>
</template>

<script lang="ts" setup>
defineProps({
  bg: { type: String, default: 'gray' },
  fg: { type: String, default: 'white' },
})
</script>

<style lang="postcss" scoped>
.tag {
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 600;
  width: max-content;
  text-wrap: nowrap;
}
</style>
