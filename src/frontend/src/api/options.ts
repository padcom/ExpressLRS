import { http } from '@/lib/http-client'
import { API } from './api'
import type { UID } from '@/types'

export class OptionsAPI extends API {
  load() {
    return http(`/options.json`)
  }

  save(options: object, uid: UID) {
    return http(`/options.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...options,
        customised: true,
        uid,
      }),
    })
  }

  reset() {
    return http(`/reset?options`, { method: 'POST' })
  }
}
