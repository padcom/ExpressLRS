import { ref } from 'vue'

import { singleton } from '@/lib/singleton'
import { ProxyAPI, type Proxy } from '@/api'

// eslint-disable-next-line max-lines-per-function
export const useProxySettings = singleton(() => {
  const proxy = ref<Proxy>()
  const originalUID = ref<number[]>([])

  // eslint-disable-next-line complexity
  async function load() {
    const response = await new ProxyAPI().load()
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

    const response = await new ProxyAPI().save(proxy.value)

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  async function reset() {
    const response = await new ProxyAPI().reset()

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  return { proxy, load, save, reset, originalUID }
})
