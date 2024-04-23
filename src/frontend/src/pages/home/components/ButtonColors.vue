<template>
  <div class="button-colors">
    <template v-for="(button, index) in buttons" :key="index">
      <div>Button {{ index + 1 }}</div>
      <ButtonColor v-model="button.color" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ButtonColor from './ButtonColor.vue'
import { useConfig } from '@/composables/config'

const { buttons } = useConfig()
</script>

<style lang="postcss" scoped>
.button-colors {
  display: grid;
  grid-template-columns: 1fr 9fr;
  align-items: center;
  gap: 2px 0;
}
</style>
