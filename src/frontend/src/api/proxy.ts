import { http } from '@/lib/http-client'
import { API } from './api'

export interface Proxy {
  customised?: boolean
  'aux-uid-switch': number
  'aux-tx-enable': number
  'proxy-uid': number[]
}

export class ProxyAPI extends API {
  load() {
    return http(`/proxy.json`)
  }

  save(proxy: object) {
    return http(`/proxy.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customised: true, ...proxy }),
    })
  }

  reset() {
    return http(`/reset?proxy`, { method: 'POST' })
  }
}
