<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <input :id="id" v-model="value" type="checkbox">
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

const value = defineModel({ type: Boolean })
</script>
