<template>
  <Field v-bind="$attrs">
    <template #icon>
      <img class="icon" :src="icon" title="PWM Output">
    </template>

    <template #default="{ id }">
      <input :id="id" v-model="editableValue" type="text" size="40">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'
import icon from './icon-pwm.svg?inline'
import { arrayEditableValue } from '@/composables/editable-value'

const value = defineModel({ type: Array, default: () => [] })

const editableValue = arrayEditableValue(value)
</script>
