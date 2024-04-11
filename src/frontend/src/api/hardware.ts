import { http } from '@/lib/http-client'
import { API } from './api'
import { cleanupObjectFromUndefined } from '@/lib/object-cleaner'

export class HardwareAPI extends API {
  load() {
    return http(`/hardware.json`)
  }

  save(hardware: object) {
    const body = {
      customised: true,
      ...cleanupObjectFromUndefined(hardware),
    }

    return http(`/hardware.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  reset() {
    return http(`/reset?hardware`, { method: 'POST' })
  }
}
