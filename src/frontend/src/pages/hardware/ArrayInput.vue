<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <input :id="id" v-model="editableValue" size="40">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'
import { arrayEditableValue } from '@/composables/editable-value'

const value = defineModel({ type: Array, default: () => [] })

const editableValue = arrayEditableValue(value)
</script>
