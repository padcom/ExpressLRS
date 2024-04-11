/* eslint-disable max-lines-per-function */
import { ref } from 'vue'

import { singleton } from '@/lib/singleton'
import { ConstantWaveAPI, type RadioNumber } from '@/api'

export const useConstantWave = singleton(() => {
  const processing = ref<any>()

  async function getNumberOfRadios() {
    const response = await new ConstantWaveAPI().getNumberOfRadio()

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
      data: response.ok ? await response.json() : undefined,
    }
  }

  async function start(radio: RadioNumber) {
    const response = await new ConstantWaveAPI().startConstantWave(radio)

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
