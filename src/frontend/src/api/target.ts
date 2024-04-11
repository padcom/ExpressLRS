import { http } from '@/lib/http-client'
import { API } from './api'

export class TargetAPI extends API {
  load() {
    return http(`/target`)
  }

  reboot() {
    return http(`/reboot`, { method: 'POST' })
  }
}

