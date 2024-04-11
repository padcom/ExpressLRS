import { http } from '@/lib/http-client'
import { API } from './api'

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
