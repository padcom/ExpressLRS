<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <input :id="id" v-model="editableValue" type="text" :size="size">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import { stringEditableValue } from '@/composables/editable-value'
import Field from './Field.vue'

defineProps({
  size: { type: Number, default: 40 },
})

const value = defineModel({ type: Number })

const editableValue = stringEditableValue(value)
</script>
