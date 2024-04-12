<template>
  <table>
    <thead>
      <PWMTableHeader />
    </thead>
    <tbody>
      <PWMOutputRow v-for="(output, index) in pwm" :key="index"
        :index="index"
        :output="output"
        @mode-changed="onModeChanged(output, $event)"
      />
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import PWMTableHeader from './PWMTableHeader.vue'
import PWMOutputRow from './PWMOutputRow.vue'
import { useConfig } from '@/composables/config'
import { type PWMOutput, isSerialCapable, setMode, getMode, isI2CCapable, isSDACapable, isSCLCapable } from '@/api'

const { pwm } = useConfig()

function onModeChanged(output: PWMOutput, newMode: number) {
  if (isSerialCapable(output)) {
    pwm.value
      .filter(isSerialCapable)
      .forEach(serialOutput => {
        if (newMode === 9) {
          setMode(serialOutput, newMode)
        } else if (getMode(serialOutput) === 9) {
          setMode(serialOutput, 0)
        }
      })
  } else if (isI2CCapable(output)) {
    pwm.value
      .filter(isI2CCapable)
      // eslint-disable-next-line complexity
      .forEach(i2cOutput => {
        if (newMode === 10 && isSDACapable(i2cOutput)) {
          setMode(i2cOutput, 11)
        } else if (newMode === 11 && isSCLCapable(i2cOutput)) {
          setMode(i2cOutput, 10)
        } else if (i2cOutput !== output) {
          setMode(i2cOutput, 0)
        }
      })
  }
}
</script>

<style lang="postcss" scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
</style>
