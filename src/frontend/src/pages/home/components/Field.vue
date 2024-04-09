<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <slot name="aux" />
    <slot :id="id" />
  </div>
</template>

<script lang="ts" setup>
import { uniqueId } from '@/composables/id'

defineProps({
  label: { type: String, default: 'Label' },
})

const id = uniqueId()
</script>

<style lang="postcss" scoped>
.field {
  display: flex;
  flex-direction: column;

  label {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0,0,0,0.54);
    margin-bottom: 2px;
  }

  & ::v-deep(input),
  & ::v-deep(select) {
    border: none;
    border-bottom: solid 1px rgba(0,0,0,0.26);
    font-size: 16px;
    outline: none;
    margin-bottom: 2px;
    background-color: white;
  }

  & ::v-deep(input) {
    padding-bottom: 2px;
  }

  & ::v-deep(select) {
    padding-bottom: 0px;
  }

  /* autoprefixer: ignore next */
  & ::v-deep(input::placeholder) {
    color: rgba(0,0,0,0.26);
  }

  &:focus-within {
    label {
      color: #2196F3;
    }

    & ::v-deep(input),
    & ::v-deep(select) {
      border-bottom: solid 2px #2196F3;
      margin-bottom: 1px;
    }
  }
}
</style>
