<template>
  <table>
    <thead>
      <tr>
        <th class="index">Output</th>
        <th class="features">Features</th>
        <th class="mode">Mode</th>
        <th class="channel">Input</th>
        <th class="invert">Invert?</th>
        <th class="is750us">750&micro;s</th>
        <th class="failsafe-mode">Failsafe Mode</th>
        <th class="failsafe-position">Failsafe Position</th>
      </tr>
    </thead>
    <tbody>
      <PWMOutputRow v-for="(output, index) in pwm" :key="index" :index="index" :output="output" />
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import PWMOutputRow from './PWMOutputRow.vue'
import { useConfig } from '@/composables/config'

const { pwm } = useConfig()
</script>

<style lang="postcss" scoped>
table {
  border-collapse: collapse;
  width: 100%;

  th {
    font-weight: 600;
  }

  th, td {
    padding: 4px 8px;
  }

  &::v-deep(input),
  &::v-deep(select) {
    width: 100%;
  }

  .index,
  &::v-deep(.index) {
    text-align: center;
    width: 20px;
  }
  .features,
  &::v-deep(.features) {
    text-align: center;
    width: 20px;
  }
  .mode,
  &::v-deep(.mode) {
    text-align: left;
  }
  .channel,
  &::v-deep(.channel) {
    text-align: left;
  }
  .invert,
  &::v-deep(.invert) {
    text-align: center;
    width: 20px;
  }
  .is750us,
  &::v-deep(.is750us) {
    text-align: center;
    width: 20px;
  }
  .failsafe-mode,
  &::v-deep(.failsafe-mode) {
    text-align: left;
  }
  .failsafe-position,
  &::v-deep(.failsafe-position) {
    text-align: left;
  }
}
</style>
