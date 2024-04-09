<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <select :id="id" v-model="value">
        <option value="0">via SEMTECH</option>
        <!--<option value='1'>ANALOG</option>-->
        <!--<option value='2'>DAC</option>-->
        <option value="3">via ESP DACWRITE</option>
      </select>
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

const value = defineModel({ type: Number })
</script>
