<template>
  <Field :label="label">
    <template #aux><slot /></template>
    <template #default="{ id }">
      <input :id="id" v-model="editableValue" v-bind="$attrs" type="text">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Field from './Field.vue'

defineProps({
  label: { type: String, default: 'Label' },
})

const value = defineModel<string[] | number[]>({ default: () => [] })

const editableValue = computed({
  get(): string {
    return value.value.join(',')
  },
  set(newValue: string) {
    value.value = newValue.split(',')
  },
})
</script>
