<template>
  <Field v-bind="$attrs">
    <template #icon>
      <Icon />
    </template>

    <template #default="{ id }">
      <input :id="id" v-model="editableValue" type="number" size="3">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import { numericEditableValue } from '@/composables/editable-value'
import Field from './Field.vue'
import Icon from './icon-output.svg'

const value = defineModel({ type: Number })

const editableValue = numericEditableValue(value)
</script>

<style lang="postcss" scoped>
input {
  width: 5rem;
}
</style>
