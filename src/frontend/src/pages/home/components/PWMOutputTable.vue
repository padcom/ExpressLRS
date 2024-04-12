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
import {
  type PWMOutput,
  isOutputSerialCapable,
  setOutputMode,
  getOutputMode,
  isOutputI2CCapable,
  isOutputSDACapable,
  isOutputSCLCapable,
} from '@/api'

const { pwm } = useConfig()

function onModeChanged(output: PWMOutput, newMode: number) {
  if (isOutputSerialCapable(output)) {
    pwm.value
      .filter(isOutputSerialCapable)
      .forEach(serialOutput => {
        if (newMode === 9) {
          setOutputMode(serialOutput, newMode)
        } else if (getOutputMode(serialOutput) === 9) {
          setOutputMode(serialOutput, 0)
        }
      })
  } else if (isOutputI2CCapable(output)) {
    pwm.value
      .filter(isOutputI2CCapable)
      // eslint-disable-next-line complexity
      .forEach(i2cOutput => {
        if (newMode === 10 && isOutputSDACapable(i2cOutput)) {
          setOutputMode(i2cOutput, 11)
        } else if (newMode === 11 && isOutputSCLCapable(i2cOutput)) {
          setOutputMode(i2cOutput, 10)
        } else if (i2cOutput !== output) {
          setOutputMode(i2cOutput, 0)
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
