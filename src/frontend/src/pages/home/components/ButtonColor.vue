<template>
  <input v-model="editableValue" type="color">
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const value = defineModel({ type: Number })

function colorToRGB(c: number) {
  let r = c & 0xE0
  r = ((r << 16) + (r << 13) + (r << 10)) & 0xFF0000
  let g = c & 0x1C
  g = ((g << 11) + (g << 8) + (g << 5)) & 0xFF00
  let b = ((c & 0x3) << 1) + ((c & 0x3) >> 1)
  b = (b << 5) + (b << 2) + (b >> 1)
  const s = (r + g + b).toString(16)

  return `#${s.padStart(6, '0')}`
}

function rgbToColor(color: string) {
  const v = parseInt(color.substring(1), 16)

  return ((v >> 16) & 0xE0) + ((v >> (8 + 3)) & 0x1C) + ((v >> 6) & 0x3)
}

const editableValue = computed({
  get() {
    return colorToRGB(value.value || 0)
  },
  set(newValue: string) {
    value.value = rgbToColor(newValue)
  },
})
</script>
