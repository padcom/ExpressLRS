<template>
  <div class="radiobutton">
    <input :id="id" v-model="modelValue" v-bind="$attrs" :value="value" type="radio">
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script lang="ts" setup>
import { uniqueId } from '@/composables/id'

defineProps({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
})

const modelValue = defineModel<string>()
const id = uniqueId()
</script>

<style lang="postcss" scoped>
.radiobutton {
  display: flex;
  gap: 24px;

  label {
    cursor: pointer;
  }
}
</style>
