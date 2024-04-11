<template>
  <Select v-bind="$attrs">
    <option :value="0">CRSF</option>
    <option :value="1">Inverted CRSF</option>
    <option :value="2">SBUS</option>
    <option :value="3">Inverted SBUS</option>
    <option :value="4">SUMD</option>
    <option :value="5">DJI RS Pro</option>
    <option :value="6">HoTT Telemetry</option>
  </Select>
</template>

<script lang="ts" setup>
import Select from '@/components/Select.vue'
</script>
