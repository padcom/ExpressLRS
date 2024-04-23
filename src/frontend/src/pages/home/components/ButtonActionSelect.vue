<template>
  <Select v-model="value" label="Action">
    <option value="0">Unused</option>
    <option value="1">Increase Power</option>
    <option value="2">Go to VTX Band Menu</option>
    <option value="3">Go to VTX Channel Menu</option>
    <option value="4">Send VTX Settings</option>
    <option value="5">Start WiFi</option>
    <option value="6">Enter Binding Mode</option>
  </Select>
</template>

<script lang="ts" setup>
import Select from '@/components/Select.vue'

const value = defineModel({ type: Number })
</script>
