<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}</label>
    <div class="field__icon">
      <slot name="icon" />
    </div>
    <div class="field__input">
      <slot :id="id" />
    </div>
    <div class="field__description">
      {{ description }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { uniqueId } from '@/composables/id'

defineProps({
  label: { type: String, default: 'Label' },
  description: { type: String, default: '' },
})

const id = uniqueId()
</script>

<style lang="postcss" scoped>
.field {
  margin-left: 24px;
  grid-column: 1 / -1;

  display: grid;
  grid-template-columns: subgrid;

  .field__icon {
    display: flex;
    justify-content: flex-end;
  }

  .field__input :deep(> *) {
    height: 24px;
  }

  .field__description {
    margin-left: 8px;
  }
}
</style>
