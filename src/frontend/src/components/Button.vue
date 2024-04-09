<template>
  <button v-bind="$attrs" :class="{ [type]: true, small }"><slot /></button>
</template>

<script lang="ts">
export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger'
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  type: { type: String as PropType<ButtonType>, default: 'primary' },
  small: { type: Boolean, default: false },
})
</script>

<style lang="postcss" scoped>
button {
  background-color: #2196F3;
  outline: none;
  border: none;
  padding: 0 26px;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  color: white;
  line-height: 36px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  width: max-content;

  &.primary {
    --color: var(--clr-btn-primary);
    background-color: var(--color);
  }

  &.secondary {
    --color: var(--clr-btn-secondary);
    background-color: var(--color);
  }

  &.tertiary {
    --color: var(--clr-btn-tertiary);
    color: black;
    background-color: var(--color);
  }

  &.danger {
    --color: var(--clr-btn-danger);
    background-color: var(--color);
  }

  &.small {
    height: 30.6px;
    line-height: 30.6px;
    padding: 0 16px;
    font-size: 13px
  }

  &:hover {
    box-shadow: 0 0px 2px rgba(0,0,0,0.12),0 2px 2px rgba(0,0,0,0.2);
    opacity: 0.8;
  }

  &[disabled] {
    background-color: var(--clr-btn-disabled);
  }
}
</style>
