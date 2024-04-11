import { http } from '@/lib/http-client'
import { API } from './api'
import type { UID } from '@/types'

export interface BuildOptions {
  customised?: boolean
  'wifi-on-interval': number
  'tlm-interval': number
  'fan-runtime': number
  'rcvr-uart-baud': number
  'unlock-higher-power': boolean
  'lock-on-first-connection': boolean
  'airport-uart-baud': number
  'is-airport': boolean
  'domain': number
  'flash-discriminator': number
  'vbind': boolean
}

export interface PWMOutput {
  /**
   * Config format: ppppppppppccccimmmmnff
   *
   * p - PWM value for failsafe
   * c - output channel
   * i - inverse
   * m - mode
   * n - narrow (750us)
   * f - failsafe mode
   */
  config: number
  pin: number
  features: number
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
  'pwm'?: PWMOutput[]
  'serial-protocol': number
  'modelid'?: number | 255
  'force-tlm'?: number
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
