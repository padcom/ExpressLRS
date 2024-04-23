<template>
  <Select v-model.number="value" label="Count">
    <option value="0">1 time</option>
    <option value="1">2 times</option>
    <option value="2">3 times</option>
    <option value="3">4 times</option>
    <option value="4">5 times</option>
    <option value="5">6 times</option>
    <option value="6">7 times</option>
    <option value="7">8 times</option>
  </Select>
</template>

<script lang="ts" setup>
import Select from '@/components/Select.vue'

const value = defineModel({ type: Number })
</script>
