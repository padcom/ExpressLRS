/* eslint-disable max-lines-per-function */
import { ref } from 'vue'

import { singleton } from '@/lib/singleton'
import { http } from '@/lib/http-client'

export type RadioNumber = '1' | '2'

export const useConstantWave = singleton(() => {
  const processing = ref<any>()

  async function getNumberOfRadios() {
    const response = await http('/cw')

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
      data: response.ok ? await response.json() : undefined,
    }
  }

  async function start(radio: RadioNumber) {
    const body = new FormData()
    body.append('radio', String(radio))
    const response = await http('/cw', { method: 'POST', body })

    processing.value = response.ok

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  return {
    getNumberOfRadios,
    start,
    processing,
  }
})
