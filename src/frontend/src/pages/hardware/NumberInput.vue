<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <input :id="id" v-model.number="editableValue" type="text" :size="size">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import { numericEditableValue } from '@/composables/editable-value'
import Field from './Field.vue'

defineProps({
  size: { type: Number, default: 40 },
})

const value = defineModel({ type: Number })

const editableValue = numericEditableValue(value)
</script>
