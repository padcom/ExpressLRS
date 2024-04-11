import { http } from '@/lib/http-client'
import { API } from './api'

export class FirmwareAPI extends API {
  forceUpdate() {
    const body = new FormData()
    body.append('action', 'confirm')

    return http(`/forceupdate`, { method: 'POST', body })
  }
}
