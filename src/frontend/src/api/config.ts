import { http } from '@/lib/http-client'
import { API } from './api'

export class ConfigAPI extends API {
  load() {
    return http(`/config`)
  }

  download() {
    return http(`/config?export`)
  }
}
