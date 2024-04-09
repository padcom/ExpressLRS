<template>
  <ul class="tab-selector">
    <li v-for="tab in tabs" :key="tab.id" class="tab-activator"
      :class="{ active: tab.id === selectedTab?.id }"
      @click="selectTab(tab)">
      {{ tab.title }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useTabs } from './tabs'

const { tabs, selectTab, selectedTab } = useTabs()
</script>

<style lang="postcss" scoped>
.tab-selector {
  display: flex;
  list-style: none;

  .tab-activator {
    flex: 1;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
    padding-block: 12px;
    border-bottom: 1px solid #0000000B;

    &.active {
      font-weight: 500;
      color: #2196F3;
      border-bottom: 2px solid #2196F3;
    }
  }
}
</style>
