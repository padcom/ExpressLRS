import { http } from '@/lib/http-client'
import { API } from './api'
import type { UID } from '@/types'
import { readBits, updateBits } from '@/lib/bits'

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
  'sbus-failsafe': number
}

export interface Config {
  'options': BuildOptions
  'config': RuntimeOptions
}

export function getMode(output: PWMOutput) {
  return readBits(output.config, 15, 4)
}

export function setMode(output: PWMOutput, newMode: number) {
  output.config = updateBits(output.config, newMode, 15, 4)
}

export function getChannel(output: PWMOutput) {
  return readBits(output.config, 10, 4)
}

export function setChannel(output: PWMOutput, newChannel: number) {
  output.config = updateBits(output.config, newChannel, 10, 4)
}

export function getIsInverted(output: PWMOutput) {
  return Boolean(readBits(output.config, 14, 1))
}

export function setIsInverted(output: PWMOutput, newIsInverted: boolean) {
  output.config = updateBits(output.config, newIsInverted ? 1 : 0, 14, 1)
}

export function getIs750us(output: PWMOutput) {
  return Boolean(readBits(output.config, 19, 1))
}

export function setIs750us(output: PWMOutput, newIs750us: boolean) {
  output.config = updateBits(output.config, newIs750us ? 1 : 0, 19, 1)
}

export function getFailsafeMode(output: PWMOutput) {
  return readBits(output.config, 20, 2)
}

export function setFailsafeMode(output: PWMOutput, newFailsafeMode: number) {
  output.config = updateBits(output.config, newFailsafeMode, 20, 2)
}

export function getFailsafePosition(output: PWMOutput) {
  return (output.config & 1023) + 988
}

export function setFailsafePosition(output: PWMOutput, newFailsafePosition: number) {
  output.config = (output.config & 0xffffc00) | (newFailsafePosition - 988)
}

export function isSerialCapable(output: PWMOutput) {
  return (output.features & 3) !== 0
}

export function isSerialTXCapable(output: PWMOutput) {
  return (output.features & 1) !== 0
}

export function isSerialRXCapable(output: PWMOutput) {
  return (output.features & 2) !== 0
}

export function isI2CCapable(output: PWMOutput) {
  return (output.features & 12) !== 0
}

export function isSCLCapable(output: PWMOutput) {
  return (output.features & 4) !== 0
}

export function isSDACapable(output: PWMOutput) {
  return (output.features & 8) !== 0
}

export function isDShotCapable(output: PWMOutput) {
  return (output.features & 16) !== 0
}

export class ConfigAPI extends API {
  load() {
    return http(`/config`)
  }

  async save(config: RuntimeOptions) {
    const response = await http('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...config,
        pwm: (config.pwm || []).map(output => output.config),
      }),
    })

    if (response.ok) {
      return {
        ok: true,
        statusText: await response.text(),
      }
    } else {
      return response
    }
  }

  download() {
    return http(`/config?export`)
  }
}
