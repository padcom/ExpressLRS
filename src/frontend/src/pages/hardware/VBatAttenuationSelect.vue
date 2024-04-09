<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <select :id="id" v-model="value">
        <option value="-1">Default</option>
        <option value="0">0 dB</option>
        <option value="1">2.5 dB</option>
        <option value="2">6 dB</option>
        <option value="3">11 dB</option>
        <option value="4">0 dB + calibration</option>
        <option value="5">2.5 dB + calibration</option>
        <option value="6">6 dB + calibration</option>
        <option value="7">11 dB + calibration</option>
      </select>
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

const value = defineModel({ type: Number })
</script>
