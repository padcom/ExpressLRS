/* eslint-disable max-lines-per-function */
import { ref, computed } from 'vue'

import { singleton } from '@/lib/singleton'
import { type TargetConfiguration } from '@/api'
import { TargetAPI } from '@/api'

export const useTarget = singleton(() => {
  const data = ref<TargetConfiguration>()
  const loaded = ref(false)

  const target = computed(() => data.value?.target)
  const version = computed(() => data.value?.version)
  const productName = computed(() => data.value?.product_name)
  const luaName = computed(() => data.value?.lua_name)
  const regDomain = computed(() => data.value?.reg_domain)
  const isTX = computed(() => data.value?.['module-type'] === 'TX')
  const isRX = computed(() => data.value?.['module-type'] === 'RX')
  const isSX128x = computed(() => data.value?.['radio-type'] === 'SX128X')
  const isSX127x = computed(() => data.value?.['radio-type'] === 'SX127X')
  const isLR1121 = computed(() => data.value?.['radio-type'] === 'LR1121')
  const hasSubGhz = computed(() => data.value?.['has-sub-ghz'])
  const multiUID = computed(() => data.value?.['multi-uid'])

  async function load() {
    const response = await new TargetAPI().load()
    if (response.ok) {
      data.value = await response.json()
      loaded.value = true
    } else {
      data.value = undefined
    }
  }

  async function reboot() {
    const response = await new TargetAPI().reboot()

    return response.ok
  }

  return {
    load,
    reboot,
    loaded,
    data,
    target,
    version,
    productName,
    luaName,
    regDomain,
    isTX,
    isRX,
    isSX128x,
    isSX127x,
    isLR1121,
    hasSubGhz,
    multiUID,
  }
})
