<template>
  <Panel>
    <SectionHeader>Constant Wave</SectionHeader>
    <p class="paragraph">
      This page puts the SX1280 into a mode where it transmits a continuous wave with a center frequency of 2.440 GHz.
    </p>
    <p class="paragraph">
      You can then measure the actual continuous wave center frequency using a spectrum analyzer and enter the measured
      value below and this will be used to calculate the accuracy of the 52MHz crystal used in the device and how far
      it differs from the ideal frequency.
    </p>

    <Content>
      <RadioGroup v-if="numberOfRadios && numberOfRadios > 0">
        <RadioButton v-model="radio" value="1" label="Radio 1" />
        <RadioButton v-if="numberOfRadios === 2" v-model="radio" value="2" label="Radio 2" />
      </RadioGroup>
      <div v-else>
        No radios were detected on the target.
      </div>
    </Content>

    <Actions>
      <Button :disabled="processing" @click="start(radio)">Start</Button>
    </Actions>

    <Content v-if="processing">
      <NumericInput v-model="centerFrequency" label="Center Frequency" step="1000" />
      <table class="results">
        <tr>
          <td>Calculated XO Freq</td>
          <td>{{ Math.round(calculatedXOFrequency) }}</td>
        </tr>
        <tr>
          <td>Calculated XO Offset (kHz)</td>
          <td>{{ Math.round(calculatedXOOffsetKHz) }}</td>
        </tr>
        <tr>
          <td>Calculated XO Offset (PPM)</td>
          <td>{{ Math.round(calculatedXOOffsetPPM) }}</td>
        </tr>
        <tr>
          <td>Raw offset (KHz)</td>
          <td>{{ rawOffset }}</td>
        </tr>
        <tr>
          <td>TL;DR</td>
          <td>
            <IconOK v-if="Math.abs(rawShift) < 90000" />
            <IconWarning v-else-if="Math.abs(rawShift) < 180000" />
            <IconError v-else />
          </td>
        </tr>
      </table>
    </Content>
  </Panel>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Content from '@/components/Content.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import RadioButton from '@/components/RadioButton.vue'
import NumericInput from '@/components/NumericInput.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'

import IconOK from './constant-wave/ok.svg'
import IconWarning from './constant-wave/warning.svg'
import IconError from './constant-wave/error.svg'

import { useConstantWave } from '@/composables/constant-wave'
import type { RadioNumber } from '@/api'

const CW_FREQ = 2440000000
const XTAL_NOMINAL = 52000000

const numberOfRadios = ref(0)
const radio = ref<RadioNumber>('1')
const centerFrequency = ref(CW_FREQ)
const { getNumberOfRadios, start, processing } = useConstantWave()

const calculatedXOFrequency = computed(() => centerFrequency.value * XTAL_NOMINAL / CW_FREQ)
const calculatedXOOffsetKHz = computed(() => (calculatedXOFrequency.value - XTAL_NOMINAL) / 1000)
const calculatedXOOffsetPPM = computed(() => Math.abs(calculatedXOFrequency.value - XTAL_NOMINAL) / 52)
const rawShift = computed(() => centerFrequency.value - CW_FREQ)
const rawOffset = computed(() => rawShift.value / 1000)

onMounted(async () => {
  const result = await getNumberOfRadios()
  if (result.status === 'ok' && result.data) {
    numberOfRadios.value = result.data.radios
  }
})
</script>

<style lang="postcss" scoped>
.results {
  border-collapse: collapse;

  td {
    border-bottom: solid 1px var(--clr-border-bottom);
    padding-block: 2px;

    svg {
      height: 28px;
      margin-left: -20px;
    }
  }
}
</style>
