<template>
  <Field :label="label" class="dropdown">
    <template #aux><slot /></template>
    <template #default="{ id }">
      <input :id="id" v-model="value" v-bind="$attrs" type="text" class="dropdown-input"
        @focus="showOptions = true"
        @blur="showOptions = false"
      >
      <div v-show="options.length > 0 && showOptions" class="dropdown-content">
        <div v-for="option in options" :key="option" class="dropdown-item" @mousedown="selectOption(option)">
          {{ option }}
        </div>
      </div>
    </template>
  </Field>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import Field from './Field.vue'

defineProps({
  label: { type: String, default: '' },
  options: { type: Array as PropType<string[]>, default: () => [] },
})

const value = defineModel<string>({ default: '' })

const showOptions = ref(false)

function selectOption(option: string) {
  value.value = option
}
</script>

<style lang="postcss" scoped>
.dropdown {
  position: relative;

  .dropdown-content {
    position: absolute;
    top: 46px;
    z-index: 1;
    background-color: white;
    max-height: 248px;
    border: 1px solid var(--clr-dropdown-options-bg);
    box-shadow: var(--dropdown-options-shadow);
    overflow: auto;
    width: 100%;

    .dropdown-item {
      padding-block: 4px;
      cursor: pointer;

      &:hover {
        background-color: var(--clr-dropdown-options-hover);
      }
    }
  }
}
</style>
