import { http } from '@/lib/http-client'
import { API } from './api'

export type RadioNumber = '1' | '2'

export class ConstantWaveAPI extends API {
  getNumberOfRadio() {
    return http('/cw')
  }

  startConstantWave(radio: RadioNumber) {
    const body = new FormData()
    body.append('radio', String(radio))

    return http('/cw', { method: 'POST', body })
  }
}
