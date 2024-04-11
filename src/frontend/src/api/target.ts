import { http } from '@/lib/http-client'
import { API } from './api'

export const RegulatoryDomains2G4 = ['ISM2G4', 'CE_LBT']

export const RegulatoryDomains915 = ['AU915', 'FCC915']

export const RegulatoryDomains868 = ['EU868', 'IN866']

export const RegulatoryDomains433 = ['AU433', 'EU433', 'US433', 'US433-Wide']

export const RegulatoryDomains = [
  ...RegulatoryDomains2G4,
  ...RegulatoryDomains915,
  ...RegulatoryDomains868,
  ...RegulatoryDomains433,
] as const

export type RegulatoryDomain = typeof RegulatoryDomains[number]

export type RadioType = 'TX' | 'RX'

export interface TargetConfiguration {
  'target': string
  'version': string
  'product_name': string
  'lua_name': string
  'reg_domain': RegulatoryDomain
  'radio-type': RadioType
  'is-sx127x': boolean
  'is-lr1121': boolean
  'has-sub-ghz': boolean
  'multi-uid': boolean
}

export class TargetAPI extends API {
  load() {
    return http(`/target`)
  }

  reboot() {
    return http(`/reboot`, { method: 'POST' })
  }
}

