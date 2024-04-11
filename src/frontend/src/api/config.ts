import { http } from '@/lib/http-client'
import { API } from './api'
import type { UID } from '@/types'

export interface BuildOptions {
  customised?: boolean
  'wifi-on-interval': number
  'tlm-interval': number
  'fan-runtime': number
  'unlock-higher-power': boolean
  'airport-uart-baud': number
  'is-airport': boolean
  'domain': number
  'flash-discriminator': number
}

export interface RuntimeOptions {
  'uid': UID
  'ssid': string
  'mode': string
  'product_name': string
  'lua_name': string
  'reg_domain': string
  'has-highpower': boolean
  'uidtype': string
}

export interface Config {
  'options': BuildOptions
  'config': RuntimeOptions
}

export class ConfigAPI extends API {
  load() {
    return http(`/config`)
  }

  download() {
    return http(`/config?export`)
  }
}
