/* eslint-disable max-lines-per-function */
import { ref, computed } from 'vue'

import { singleton } from '@/lib/singleton'
import { http } from '@/lib/http-client'
import type { TargetConfiguration } from '@/types'

export const useTarget = singleton(() => {
  const data = ref<TargetConfiguration>()
  const loaded = ref(false)

  const target = computed(() => data.value?.target)
  const version = computed(() => data.value?.version)
  const productName = computed(() => data.value?.product_name)
  const luaName = computed(() => data.value?.lua_name)
  const regDomain = computed(() => data.value?.reg_domain)
  const isTx = computed(() => data.value?.['is-tx'])
  const isRx = computed(() => data.value?.['is-rx'])
  const isSX127x = computed(() => data.value?.['is-sx127x'])
  const isLR1121 = computed(() => data.value?.['is-lr1121'])
  const hasSubGhz = computed(() => data.value?.['has-sub-ghz'])
  const multiUID = computed(() => data.value?.['multi-uid'])

  async function load() {
    const response = await http(`/target`)
    if (response.ok) {
      data.value = await response.json()
      loaded.value = true
    } else {
      data.value = undefined
    }
  }

  async function reboot() {
    const response = await http(`/reboot`, { method: 'POST' })

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
    isTx,
    isRx,
    isSX127x,
    isLR1121,
    hasSubGhz,
    multiUID,
  }
})
