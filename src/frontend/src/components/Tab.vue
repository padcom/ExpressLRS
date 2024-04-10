<template>
  <div :id="id" class="tab" :class="{ active: selectedTab?.id === id }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { v4 as uuid } from 'uuid'
import { onMounted, onBeforeUnmount } from 'vue'

import { useTabs, type Tab } from './tabs'

const props = defineProps({
  id: { type: String, default: () => uuid() },
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
