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

export type ModuleType = 'TX' | 'RX'

export type RadioType = 'SX128X' | 'SX127X' | 'LR1121'

export interface TargetConfiguration {
  'target': string
  'version': string
  'product_name': string
  'lua_name': string
  'reg_domain': RegulatoryDomain
  'module-type': ModuleType
  'radio-type': RadioType
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

