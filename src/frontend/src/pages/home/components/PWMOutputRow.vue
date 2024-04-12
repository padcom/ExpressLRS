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
        <option v-if="isDShotCapable(output)" :value="8">DShot</option>
        <option v-if="isSerialTXCapable(output)" :value="9">Serial TX</option>
        <option v-if="isSerialRXCapable(output)" :value="9">Serial RX</option>
        <option v-if="isSCLCapable(output)" :value="10">I²C SCL</option>
        <option v-if="isSDACapable(output)" :value="11">I²C SDA</option>
      </Select>
    </td>
    <td class="channel">
      <Select v-model="input"
        :disabled="modeDisablesEditing()"
      >
        <option v-for="channel in 4" :key="channel" :value="channel - 1">
          ch{{ channel }}
        </option>
        <option v-for="channel in 12" :key="channel" :value="channel - 1 + 4">
          ch{{ channel + 4 }} (AUX{{ channel }})
        </option>
      </Select>
    </td>
    <td class="invert">
      <input v-model="inverted" type="checkbox"
        :disabled="modeDisablesEditing()"
      >
    </td>
    <td class="is750us">
      <input v-model="is750us" type="checkbox"
        :disabled="modeDisablesEditing()"
      >
    </td>
    <td class="failsafe-mode">
      <Select v-model="failsafeMode"
        :disabled="modeDisablesEditing()"
      >
        <option :value="0">Set Position</option>
        <option :value="1">No Pulses</option>
        <option :value="2">Last Position</option>
      </Select>
    </td>
    <td class="failsafe-position">
      <NumericInput v-if="failsafeMode === 0" v-model="failsafePosition" size="6"
        :disabled="modeDisablesEditing()"
      />
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'

import Tag from '@/components/Tag.vue'
import Select from '@/components/Select.vue'
import NumericInput from '@/components/NumericInput.vue'

import {
  type PWMOutput,
  isSerialTXCapable,
  isSerialRXCapable,
  isSCLCapable,
  isSDACapable,
  isDShotCapable,
  getMode,
  setMode,
  getChannel,
  setChannel,
  getIsInverted,
  setIsInverted,
  getIs750us,
  setIs750us,
  getFailsafeMode,
  setFailsafeMode,
  getFailsafePosition,
  setFailsafePosition,
} from '@/api'

const props = defineProps({
  index: { type: Number, required: true },
  output: { type: Object as PropType<PWMOutput>, required: true },
})

const emit = defineEmits<{(e: 'mode-changed', mode: number): void}>()

function modeDisablesEditing() {
  return [9, 10, 11].includes(getMode(props.output))
}

const mode = computed({
  get() {
    return getMode(props.output)
  },
  set(value: number) {
    setMode(props.output, value)
    emit('mode-changed', value)
  },
})

const input = computed({
  get() {
    return getChannel(props.output)
  },
  set(value: number) {
    setChannel(props.output, value)
  },
})

const inverted = computed({
  get() {
    return getIsInverted(props.output)
  },
  set(value: boolean) {
    setIsInverted(props.output, value)
  },
})

const is750us = computed({
  get() {
    return getIs750us(props.output)
  },
  set(value: boolean) {
    setIs750us(props.output, value)
  },
})

const failsafeMode = computed({
  get() {
    return getFailsafeMode(props.output)
  },
  set(value: number) {
    setFailsafeMode(props.output, value)
  },
})

const failsafePosition = computed({
  get() {
    return getFailsafePosition(props.output)
  },
  set(value: number) {
    setFailsafePosition(props.output, value)
  },
})
</script>

<style lang="postcss" scoped>
td {
  padding: 8px;
}

.index,
.features,
.invert,
.is750us {
  text-align: center;
  width: 20px;
}

.mode,
.channel {
  width: 25%;
}

.failsafe-mode,
.failsafe-position {
  width: 20%;
}
</style>
