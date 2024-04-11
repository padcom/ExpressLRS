import { http } from '@/lib/http-client'
import { API } from './api'

export class WiFiAPI extends API {
  connectToNetwork(ssid: string, password: string, temporary: boolean) {
    const body = new FormData()
    body.append('networktype', temporary ? '1' : '0')
    body.append('network', ssid)
    body.append('password', password)

    const url = temporary ? '/sethome' : '/sethome?save'

    return http(url, { method: 'POST', body })
  }

  startAccessPoint() {
    return http(`/access`, { method: 'POST' })
  }

  forgetNetworkAndStartAccessPoint() {
    return http(`/forget`, { method: 'POST' })
  }
}

