<template>
  <Panel>
    <SectionHeader>{{ title }}</SectionHeader>
    <p>
      Here you can join a network and it will be saved as your Home network.
      When you enable WiFi in range of your Home network, ExpressLRS will automatically connect to it.
      In Access Point (AP) mode, the network name is ExpressLRS TX or ExpressLRS RX with password "expresslrs".
    </p>

    <Content>
      <RadioGroup>
        <RadioButton v-model="action" value="new-network" label="Set new Home network" />
        <RadioButton v-model="action" value="one-time" label="One-time connect to network, ratain Home network setting" />
        <RadioButton v-model="action" value="start-ap" label="Start AP mode, ratain Home network setting" />
        <RadioButton v-model="action" value="forget" label="Forget Home network setting, always use AP mode" />
      </RadioGroup>
      <DropdownInput v-if="showWiFiControls" v-model="ssid" class="ssid" label="WiFi SSID" placeholder="SSID"
        :options="networks"
        :class="{ loading }"
      />
      <TextInput v-if="showWiFiControls" v-model="password" label="WiFi password" type="password" />
    </Content>

    <Actions>
      <Button v-if="action === 'new-network'" :disabled="!ssid || password.length < 8" @click="connect(ssid, password, false)">
        Confirm
      </Button>
      <Button v-if="action === 'one-time'" :disabled="!ssid || password.length < 8" @click="connect(ssid, password, true)">
        Confirm
      </Button>
      <Button v-if="action === 'start-ap'" @click="accessPoint()">
        Confirm
      </Button>
      <Button v-if="action === 'forget'" @click="forget()">
        Confirm
      </Button>
    </Actions>
  </Panel>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Content from '@/components/Content.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import RadioButton from '@/components/RadioButton.vue'
import TextInput from '@/components/TextInput.vue'
import DropdownInput from '@/components/DropdownInput.vue'

import { useConfig } from '@/composables/config'
import { useNetworks } from '@/composables/networks'
import { useAlert } from '@/composables/alert'
import { useWiFi } from '@/composables/wifi'

const { config } = useConfig()
const { networks, loading } = useNetworks()
const action = ref('new-network')
const ssid = ref('')
const password = ref('')

const showWiFiControls = computed(() => ['new-network', 'one-time'].includes(action.value))

const title = computed(() => {
  if (config.value?.config.mode === 'AP') {
    return 'Currently in Access Point mode'
  } else {
    return `Current Home network: ${config.value?.config.ssid}`
  }
})

const { connectToNetwork, startAccessPoint, forgetNetworkAndStartAccessPoint } = useWiFi()
const { info, error } = useAlert()

// eslint-disable-next-line @typescript-eslint/no-shadow
async function connect(ssid: string, password: string, temporary: boolean) {
  const result = await connectToNetwork(ssid, password, temporary)
  if (result.status === 'ok') {
    info('Start Access Point', result.msg)
  } else {
    error('Start Access Point', result.msg)
  }
}

async function accessPoint() {
  const result = await startAccessPoint()
  if (result.status === 'ok') {
    info('Start Access Point', result.msg)
  } else {
    error('Start Access Point', result.msg)
  }
}

async function forget() {
  const result = await forgetNetworkAndStartAccessPoint()
  if (result.status === 'ok') {
    info('Forget Home Network', result.msg)
  } else {
    error('Forget Home Network', result.msg)
  }
}
</script>

<style lang="postcss" scoped>
.ssid.loading ::v-deep(input) {
  background: url('./wifi.svg');
  background-repeat: no-repeat;
  background-position: right;
}
</style>
