<template>
  <component :is="is" class="panel">
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  is: { type: String, default: 'div' },
})
</script>

<style lang="postcss" scoped>
.panel {
  padding: 14px 15px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16),0 0px 2px 0 rgba(0,0,0,0.12);
  margin-bottom: 24px;
}
</style>
