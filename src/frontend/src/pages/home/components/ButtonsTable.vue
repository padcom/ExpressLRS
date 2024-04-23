<template>
  <table>
    <template v-for="(button, buttonIndex) in buttons" :key="buttonIndex">
      <ButtonTableRow v-for="(action, actionIndex) in button.action" :key="actionIndex"
        :index="buttonIndex"
        :action="action"
      />
    </template>
  </table>
</template>

<script lang="ts" setup>
import ButtonTableRow from './ButtonTableRow.vue'
import { useConfig } from '@/composables/config'

const { buttons } = useConfig()
</script>

<style lang="postcss" scoped>
table {
  table-layout: fixed;
}
</style>
