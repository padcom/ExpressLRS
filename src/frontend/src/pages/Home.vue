<template>
  <Tabs>
    <Tab v-if="isRX" title="Model">
      <Model />
    </Tab>
    <Tab title="Options">
      <Options />
      <ImportExportOptions />
    </Tab>
    <Tab v-if="multiUID" title="Proxy">
      <Proxy />
    </Tab>
    <Tab title="WiFi" @selected="autoPopulateWifiNetworks && loadWiFiNetworks()">
      <WiFi />
    </Tab>
    <Tab v-if="isTX && false" title="Buttons">
      <Buttons />
    </Tab>
    <Tab title="Update">
      <FirmwareUpdate />
    </Tab>
  </Tabs>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'
import Model from './home/Model.vue'
import Options from './home/Options.vue'
import Proxy from './home/Proxy.vue'
import ImportExportOptions from './home/ImportExportOptions.vue'
import WiFi from './home/WiFi.vue'
import Buttons from './home/Buttons.vue'
import FirmwareUpdate from './home/FirmwareUpdate.vue'
import { useConfig } from '@/composables/config'
import { useTarget } from '@/composables/target'
import { useNetworks } from '@/composables/networks'

const { load } = useConfig()
const { isRX, isTX, multiUID } = useTarget()
const { load: loadWiFiNetworks } = useNetworks()
const autoPopulateWifiNetworks = ref(false)

onMounted(load)
</script>
