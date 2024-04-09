import { ref } from 'vue'

import type { Proxy } from '@/types'
import { singleton } from '@/lib/singleton'
import { http } from '@/lib/http-client'

// eslint-disable-next-line max-lines-per-function
export const useProxySettings = singleton(() => {
  const proxy = ref<Proxy>()
  const originalUID = ref<number[]>([])

  // eslint-disable-next-line complexity
  async function load() {
    const response = await http(`/proxy.json`)
    if (response.ok) {
      proxy.value = await response.json()

      if (proxy.value) {
        proxy.value['aux-tx-enable'] = proxy.value['aux-tx-enable'] || 0
        proxy.value['aux-uid-switch'] = proxy.value['aux-uid-switch'] || 0
      }
      originalUID.value = proxy.value?.['proxy-uid'] || []
    } else {
      proxy.value = {
        'proxy-uid': [],
        'aux-tx-enable': 0,
        'aux-uid-switch': 0,
      }
      originalUID.value = []
    }
  }

  async function save() {
    if (!proxy.value) {
      return {
        status: 'error',
        msg: 'Proxy settings not loaded',
      }
    }

    const response = await http(`/proxy.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customised: true, ...proxy.value }),
    })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  async function reset() {
    const response = await http(`/reset?proxy`, { method: 'POST' })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  return { proxy, load, save, reset, originalUID }
})
