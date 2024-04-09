<template>
  <div class="field">
    <input :id="id" v-model="value" type="checkbox" v-bind="$attrs">
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script lang="ts" setup>
import { uniqueId } from '@/composables/id'

defineProps({
  label: { type: String, default: 'Label' },
})

const value = defineModel<boolean>({ default: false })

const id = uniqueId()
</script>

<style lang="postcss" scoped>
.field {
  display: flex;
  align-items: center;
  gap: 24px;

  label {
    cursor: pointer;
  }
}
</style>
