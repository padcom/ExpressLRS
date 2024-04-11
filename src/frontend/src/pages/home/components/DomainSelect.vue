<template>
  <Select v-bind="$attrs">
    <option value="0">AU915</option>
    <option value="1">FCC915</option>
    <option value="2">EU868</option>
    <option value="3">IN866</option>
    <option value="4">AU433</option>
    <option value="5">EU433</option>
    <option value="6">US433</option>
    <option value="7">US433-Wide</option>
  </Select>
</template>

<script lang="ts" setup>
import Select from '@/components/Select.vue'
</script>
