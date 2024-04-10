<template>
  <Field :label="label">
    <template #aux><slot /></template>
    <template #default="{ id }">
      <input :id="id" v-model="value" v-bind="$attrs" type="number">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

defineProps({
  label: { type: String, default: 'Label' },
})

const value = defineModel<number>()
</script>
