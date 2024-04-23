<template>
  <Select v-model.number="value" label="Delay">
    <option value="0">for 0.5 seconds</option>
    <option value="1">for 1 second</option>
    <option value="2">for 1.5 seconds</option>
    <option value="3">for 2 seconds</option>
    <option value="4">for 2.5 seconds</option>
    <option value="5">for 3 seconds</option>
    <option value="6">for 3.5 seconds</option>
    <option value="7">for 4 seconds</option>
  </Select>
</template>

<script lang="ts" setup>
import Select from '@/components/Select.vue'

const value = defineModel({ type: Number })
</script>
