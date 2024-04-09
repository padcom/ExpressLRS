export type UID = number[]

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

export interface TargetConfiguration {
  'target': string
  'version': string
  'product_name': string
  'lua_name': string
  'reg_domain': RegulatoryDomain
  'is-tx': boolean
  'is-rx': boolean
  'is-sx127x': boolean
  'is-lr1121': boolean
  'has-sub-ghz': boolean
  'multi-uid': boolean
}

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

export interface Proxy {
  customised?: boolean
  'aux-uid-switch': number
  'aux-tx-enable': number
  'proxy-uid': number[]
}
