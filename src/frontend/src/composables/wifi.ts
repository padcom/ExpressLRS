import { singleton } from '@/lib/singleton'
import { WiFiAPI } from '@/api'

// eslint-disable-next-line max-lines-per-function
export const useWiFi = singleton(() => {
  async function connectToNetwork(ssid: string, password: string, temporary: boolean) {
    const response = await new WiFiAPI().connectToNetwork(ssid, password, temporary)

    return {
      status: response.ok ? 'ok' : 'error',
      msg: await response.text(),
    }
  }

  async function startAccessPoint() {
    const response = await new WiFiAPI().startAccessPoint()

    return {
      status: response.ok ? 'ok' : 'error',
      msg: await response.text(),
    }
  }

  async function forgetNetworkAndStartAccessPoint() {
    const response = await new WiFiAPI().forgetNetworkAndStartAccessPoint()

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
