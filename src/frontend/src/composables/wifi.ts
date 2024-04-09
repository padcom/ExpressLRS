import { singleton } from '@/lib/singleton'
import { http } from '@/lib/http-client'

// eslint-disable-next-line max-lines-per-function
export const useWiFi = singleton(() => {
  async function connectToNetwork(ssid: string, password: string, temporary: boolean) {
    const body = new FormData()
    body.append('networktype', temporary ? '1' : '0')
    body.append('network', ssid)
    body.append('password', password)

    const url = temporary ? '/sethome' : '/sethome?save'
    const response = await http(url, { method: 'POST', body })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: await response.text(),
    }
  }

  async function startAccessPoint() {
    const response = await http(`/access`, { method: 'POST' })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: await response.text(),
    }
  }

  async function forgetNetworkAndStartAccessPoint() {
    const response = await http(`/forget`, { method: 'POST' })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: await response.text(),
    }
  }

  return {
    connectToNetwork,
    startAccessPoint,
    forgetNetworkAndStartAccessPoint,
  }
})
