<template>
  <div :id="id" class="tab" :class="{ active: selectedTab?.id === id }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'

import { useTabs, type Tab } from './tabs'

const props = defineProps({
  id: { type: String, default: () => crypto.randomUUID() },
  title: { type: String, default: 'Tab' },
})

const emit = defineEmits<{(e: 'selected', tab: Tab): void}>()

const { addTab, removeTab, selectedTab } = useTabs()

function onTabSelected(tab: Tab) {
  emit('selected', tab)
}

onMounted(() => {
  addTab({ title: props.title, id: props.id, onTabSelected })
})

onBeforeUnmount(() => {
  removeTab({ title: props.title, id: props.id, onTabSelected })
})
</script>

<style lang="postcss" scoped>
.tab {
  display: none;
}

.tab.active {
  display: block;
}
</style>
