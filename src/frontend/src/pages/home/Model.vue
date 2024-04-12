<template>
  <Panel v-if="config">
    <SectionHeader>PWM Output</SectionHeader>

    <p class="paragraph">
      Set PWM output mode and failsafe positions.
      <ul class="list">
        <li>
          <strong>Output</strong>: Receiver output pin
        </li>
        <li>
          <strong>Features</strong>: If an output is capable of supporting another function,
          that is indicated here
        </li>
        <li>
          <strong>Mode</strong>: Output frequency, 10KHz 0-100% duty cycle, binary On/Off or
          Serial (for MCU pins 1 and 3 only) mode
          <ul class="list">
            <li>
              When enabling serial pins, be sure to select the <strong>Serial Protocol</strong>
              below and <strong>UART baud</strong> on the Options tab
            </li>
          </ul>
        </li>
        <li>
          <strong>Input</strong>: Input channel from the handset
        </li>
        <li>
          <strong>Invert</strong>: Invert input channel position
        </li>
        <li>
          <strong>750us</strong>: Use half pulse width (494-1006us) with center 750us instead of 988-2012us
        </li>
        <li>
          <strong>Failsafe</strong>
          <ul class="list">
            <li>
              "Set Position" sets the servo to an absolute "Failsafe Pos"
              <ul class="list">
                <li>Does not use "Invert" flag</li>
                <li>Value will be halved if "750us" flag is set</li>
                <li>Will be converted to binary for "On/Off" mode (>1500us = HIGH)</li>
              </ul>
            </li>
            <li>
              "No Pulses" stops sending pulses
              <ul class="list">
                <li>Unpowers servos</li>
                <li>May disarm ESCs</li>
              </ul>
            </li>
            <li>
              "Last Position" continues sending last received channel position
            </li>
          </ul>
        </li>
      </ul>
    </p>

    <Panel>
      <PWMOutputTable />
    </Panel>

    <div v-if="hasSerialOutputs">
      <SectionHeader>Serial protocol</SectionHeader>
      <p class="paragraph">
        Set the protocol used to communicate with the flight controller or other external devices.
      </p>
      <Content>
        <SerialProtocolSelect v-model="config.config['serial-protocol']" />
      </Content>

      <div v-if="[2, 3, 5].includes(config.config['serial-protocol'])">
        <SectionHeader>SBUS Failsafe</SectionHeader>
        <p class="paragraph">
          Set the failsafe behavior when using the SBUS protocol:
          <ul class="list">
            <li>"No Pulses" stops sending SBUS data when a connection to the transmitter is lost</li>
            <li>"Last Position" continues to send the last received channel data along with the FAILSAFE bit set</li>
          </ul>
        </p>
        <Content>
          <Select v-model="config.config['sbus-failsafe']" label="SBUS Failsafe">
            <option :value="0">No Pulses</option>
            <option :value="1">Last Position</option>
          </Select>
        </Content>
      </div>
    </div>

    <div>
      <SectionHeader>Model Match</SectionHeader>
      <p class="paragraph">
        Specify the 'Receiver' number in OpenTX/EdgeTX model setup page and turn on the 'Model Match'
        in the ExpressLRS Lua script for that model. 'Model Match' is between 0 and 63 inclusive.
      </p>
      <Content>
        <Checkbox v-model="modelMatchEnabled" label="Enable Model Match" />
        <NumericInput v-if="modelMatchEnabled" v-model="config.config.modelid" label="Model ID" />
      </Content>
    </div>

    <div>
      <SectionHeader>Force telemetry off</SectionHeader>
      <p class="paragraph">
        When running multiple receivers simultaneously from the same TX (to increase the number of
        PWM servo outputs), there can be at most one receiver with telemetry enabled.
        <br>
        Enable this option to ignore the "Telem Ratio" setting on the TX and never send telemetry from this receiver.
      </p>
      <Content>
        <Checkbox v-model="forceTelemetry" label="Force telemetry OFF on this receiver" />
      </Content>
    </div>

    <Actions>
      <Button type="primary" @click="save">
        Save
      </Button>
    </Actions>
  </Panel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
import PWMOutputTable from './components/PWMOutputTable.vue'
import SerialProtocolSelect from './components/SerialProtocolSelect.vue'
import NumericInput from '@/components/NumericInput.vue'
import Checkbox from '@/components/Checkbox.vue'
import Select from '@/components/Select.vue'
import Content from '@/components/Content.vue'

import { useConfig } from '@/composables/config'
import { useAlert } from '@/composables/alert'
import { readBits } from '@/lib/bits'

const { config, pwm, save: saveConfig } = useConfig()

const hasSerialOutputs = computed(() => (pwm.value || []).some(output => readBits(output.config, 15, 4) === 9))

const modelMatchEnabled = computed({
  get() {
    return Boolean(config.value?.config.modelid !== 255)
  },
  set(value: boolean) {
    if (config.value) {
      if (!value) config.value.config.modelid = 255
      else config.value.config.modelid = undefined
    }
  },
})

const forceTelemetry = computed({
  get() {
    return Boolean(config.value?.config['force-tlm'])
  },
  set(value: boolean) {
    if (config.value) {
      config.value.config['force-tlm'] = value ? 1 : 0
    }
  },
})

const { info, error } = useAlert()

async function save() {
  const result = await saveConfig()

  if (result.status === 'ok') {
    info('Set Configuration', result.msg)
  } else {
    error('Set Configuration', result.msg)
  }
}
</script>
