/* eslint-disable max-lines-per-function */
import { ref } from 'vue'

import { singleton } from '@/lib/singleton'
import { HardwareAPI } from '@/api'

export const useHardware = singleton(() => {
  const hardware = ref<any>()

  async function load() {
    const response = await new HardwareAPI().load()

    if (response.ok) {
      hardware.value = await response.json()
    } else {
      hardware.value = undefined
    }
  }

  async function save() {
    if (!hardware.value) return false

    const response = await new HardwareAPI().save(hardware.value)

    if (response.ok) {
      hardware.value = await response.json()

      return true
    } else {
      return false
    }
  }

  async function reset() {
    const response = await new HardwareAPI().reset()

    return response.ok
  }

  return { hardware, load, save, reset }
})
