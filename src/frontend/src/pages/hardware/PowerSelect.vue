<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <select :id="id" v-model="value">
        <option value="0">10mW</option>
        <option value="1">25mW</option>
        <option value="2">50mW</option>
        <option value="3">100mW</option>
        <option value="4">250mW</option>
        <option value="5">500mW</option>
        <option value="6">1000mW</option>
        <option value="7">2000mW</option>
      </select>
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

const value = defineModel({ type: Number })
</script>
