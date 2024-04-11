<template>
  <Panel>
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

    <Content>
      <Panel>
        <PWMOutputTable />
      </Panel>
    </Content>

    <Actions>
      <Button type="primary">
        Save
      </Button>
    </Actions>
  </Panel>
</template>

<script lang="ts" setup>
import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Content from '@/components/Content.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
import PWMOutputTable from './components/PWMOutputTable.vue'
</script>
