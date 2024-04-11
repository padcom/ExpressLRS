<template>
  <Panel>
    <SectionHeader>Proxy</SectionHeader>
    <p class="paragraph">
      Here you can configure re-translator proxy.
      The proxy mechanism (otherwise known as re-translator) is a way to extend the range of your control
      link beyond what would otherwise be possible. It is achieved by having a separate pair of RX+TX mounted
      much higher than the operator's transmitter and re-transmitting the signal from that intermediate receiver
      through an intermediate transmitter back to the drone.
    </p>
    <!--
    <p class="paragraph">
      The term <strong>Proxy</strong> means that it is an intermediary between the actual recipient of data (receiver
      on the drone) and the original sender of data (transmitter on the operator's radio).
    </p>
    <p class="paragraph">
      The proxy's receiver will have a different binding phrase (<strong>Secondary UID</strong>), that the operator's
      radio transmitter can switch to by setting an AUX channel (<strong>Channel to control proxy connection</strong>)
      high (above 1750ms).
      However, the proxy transmitter will have the same binding phrase as the primary binding phrase on the operator's
      transmitter. Therefore, for those two not to collide, the proxy's transmitter remains inactive until
      the AUX channel turns <strong>high</strong> and the operator's transmitter uses the secondary UID to talk to
      the proxy's receiver.
    </p>
    <h4>The sequence of events is as follows:</h4>
    <p class="paragraph">
      <ul class="list">
        <li>You take off normally</li>
        <li>
          Once you need to extend your range you switch to the proxy by changing the AUX channel high.
          This changes the operator's binding phrase so it can talk to the proxy instead of the drone.
          Once that happens the proxy's transmitter takes over the transmission to the drone.
        </li>
        <li>
          <p>
            When you don't need the extended range anymore you switch back the AUX to low and the proxy is deactivated
            and the proxy transmitter is disabled once again to not interfere with the operator's radio
          </p>
        </li>
      </ul>
    </p>
-->
    <Content v-if="proxy">
      <TextInput v-model="bindingPhrase"
        label="Secondary binding phrase"
        placeholder="Binding phrase"
      />
      <ArrayInput v-model="proxy['proxy-uid']" label="Secondary UID" readonly />
      <Select v-model.number="proxy['aux-uid-switch']" label="Channel to control UID switching">
        <option :value="0">DISABLED</option>
        <option v-for="index in 12" :key="index" :value="index + 4">AUX{{ index + 4 }}</option>
      </Select>
      <Select v-model.number="proxy['aux-tx-enable']" label="Channel to control proxy TX">
        <option :value="0">DISABLED</option>
        <option v-for="index in 12" :key="index" :value="index + 4">AUX{{ index + 4 }}</option>
      </Select>
    </Content>

    <Actions v-if="proxy">
      <Button type="primary" @click="save">Save proxy settings</Button>
      <Button v-if="proxy.customised" type="danger" small @click="reset">
        Reset proxy options to defaults
      </Button>
    </Actions>
  </Panel>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Content from '@/components/Content.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'
import ArrayInput from '@/components/ArrayInput.vue'
import Select from '@/components/Select.vue'

import { useAlert } from '@/composables/alert'
import { useProxySettings } from '@/composables/proxy'
import { useTarget } from '@/composables/target'

import { uid } from '@/lib/uid'

const { info, question, error } = useAlert()
const { proxy, load: loadProxySettings, save: saveProxySettings, reset: resetProxySettings, originalUID } = useProxySettings()
const { reboot } = useTarget()
const bindingPhrase = ref('')

watch(bindingPhrase, newValue => {
  if (proxy.value) {
    if (newValue) {
      proxy.value['proxy-uid'] = uid(newValue)
    } else {
      proxy.value['proxy-uid'] = originalUID.value
    }
  }
})

onMounted(loadProxySettings)

async function save() {
  const result = await saveProxySettings()
  if (result.status === 'ok') {
    if (await question(
      'Proxy settings',
      'Proxy settings have been saved. Do you want to restart now for the changes to take effect?',
      'Reboot',
      'No',
    ) !== 'cancel') {
      reboot()
    }
  } else {
    error('Proxy settings', result.msg)
  }
}

async function reset() {
  const result = await resetProxySettings()
  if (result.status === 'ok') {
    info('Proxy settings', 'Reset complete, rebooting...')
  } else {
    error('Proxy settings', result.msg)
  }
}
</script>
