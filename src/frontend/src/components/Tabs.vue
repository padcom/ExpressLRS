<template>
  <div class="tabs">
    <TabSelector />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import TabSelector from './TabSelector.vue'
import { provideTabs, type Tab } from './tabs'

const emit = defineEmits<{(e: 'tab-selected', tab: Tab | undefined): void}>()

function onTabSelected(tab: Tab | undefined) {
  emit('tab-selected', tab)
}

provideTabs(onTabSelected)
</script>

<style lang="postcss" scoped>
.tabs {
  display: block;
}
</style>
