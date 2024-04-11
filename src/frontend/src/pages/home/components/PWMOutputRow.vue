<template>
  <tr>
    <td class="index">
      {{ index + 1 }}
    </td>
    <td class="features">
      <Tag v-if="output.features & 1" bg="#a8dcfa" fg="#696969">TX</Tag>
      <Tag v-if="output.features & 2" bg="#d2faa8" fg="#696969">RX</Tag>
      <Tag v-if="output.features & 4" bg="#fab4a8" fg="#696969">SCL</Tag>
      <Tag v-if="output.features & 8" bg="#fab4a8" fg="#696969">SDA</Tag>
    </td>
    <td class="mode">
      <Select v-model="mode">
        <option :value="0">50Hz</option>
        <option :value="1">60Hz</option>
        <option :value="2">100Hz</option>
        <option :value="3">160Hz</option>
        <option :value="4">333Hz</option>
        <option :value="5">400Hz</option>
        <option :value="6">10KHzDuty</option>
        <option :value="7">On/Off</option>
        <option v-if="output.features & 16" :value="8">DShot</option>
        <option v-if="output.features & 1" :value="9">Serial TX</option>
        <option v-if="output.features & 2" :value="9">Serial RX</option>
        <option v-if="output.features & 4" :value="10">I²C SCL</option>
        <option v-if="output.features & 8" :value="11">I²C SDA</option>
      </Select>
    </td>
    <td class="channel">
      <Select v-model="input">
        <option v-for="channel in 4" :key="channel" :value="channel - 1">
          ch{{ channel }}
        </option>
        <option v-for="channel in 12" :key="channel" :value="channel - 1 + 4">
          ch{{ channel + 4 }} (AUX{{ channel }})
        </option>
      </Select>
    </td>
    <td class="invert">
      <input v-model="inverted" type="checkbox">
    </td>
    <td class="is750us">
      <input v-model="is750us" type="checkbox">
    </td>
    <td class="failsafe-mode">
      <Select v-model="failsafeMode">
        <option :value="0">Set Position</option>
        <option :value="1">No Pulses</option>
        <option :value="2">Last Position</option>
      </Select>
    </td>
    <td class="failsafe-position">
      <NumericInput v-if="failsafeMode === 0" v-model="failsafePosition" />
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import Tag from '@/components/Tag.vue'
import Select from '@/components/Select.vue'
import NumericInput from '@/components/NumericInput.vue'

import { type PWMOutput } from '@/api'

const props = defineProps({
  index: { type: Number, required: true },
  output: { type: Object as PropType<PWMOutput>, required: true },
})

const mode = computed({
  get() {
    return (props.output.config >> 15) & 15
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(value: number) {
    // START HERE: zero out the bits 15-19 and set the value
    // props.output.config = props.output.config & 0 value << 15
  },
})

const input = computed({
  get() {
    return (props.output.config >> 10) & 15
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  set(value: number) {
  },
})

const inverted = computed({
  get() {
    return Boolean((props.output.config >> 14) & 1)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  set(value: boolean) {
  },
})

const is750us = computed({
  get() {
    return Boolean((props.output.config >> 19) & 1)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  set(value: boolean) {
  },
})

const failsafeMode = computed({
  get() {
    return (props.output.config >> 20) & 3
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  set(value: number) {
  },
})

const failsafePosition = computed({
  get() {
    return (props.output.config & 1023) + 988
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  set(value: number) {
  },
})
</script>
