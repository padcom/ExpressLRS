<template>
  <Field v-bind="$attrs">
    <template #default="{ id }">
      <select :id="id" v-model="value">
        <option value="0">None</option>
        <option value="1">I2C OLED (SSD1306 128x64)</option>
        <option value="2">SPI OLED (SSD1306 128x64)</option>
        <option value="3">SPI OLED (small SSD1306 128x32)</option>
        <option value="4">SPI TFT (ST7735 160x80)</option>
      </select>
    </template>
  </Field>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

const value = defineModel({ type: Number })
</script>
