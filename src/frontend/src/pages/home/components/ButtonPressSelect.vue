<template>
  <Select v-model.number="editableValue" label="Press">
    <option value="1">Short press (click)</option>
    <option value="2">Long press (hold)</option>
  </Select>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Select from '@/components/Select.vue'

const value = defineModel({ type: Boolean })

const editableValue = computed({
  get() {
    return value.value ? 2 : 1
  },
  set(newValue: number) {
    if (newValue === 1) value.value = false
    else value.value = true
  },
})
</script>
