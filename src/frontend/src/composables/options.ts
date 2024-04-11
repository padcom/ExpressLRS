/* eslint-disable max-lines-per-function */
import { ref } from 'vue'

import { type BuildOptions } from '@/api'
import { singleton } from '@/lib/singleton'
import { useConfig } from './config'
import { OptionsAPI } from '@/api'

export const useOptions = singleton(() => {
  const options = ref<BuildOptions>()

  async function load() {
    const response = await new OptionsAPI().load()

    if (response.ok) {
      options.value = await response.json()
      const { config } = useConfig()
      if (config.value && options.value) {
        config.value.options = options.value
      }
    } else {
      options.value = undefined
    }
  }

  async function save() {
    const { config } = useConfig()
    if (!config.value || !options.value) {
      return {
        ok: false,
        msg: 'Options not loaded',
      }
    }

    const response = await new OptionsAPI().save(config.value, config.value.config.uid)

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  async function reset() {
    const response = await new OptionsAPI().reset()

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  return { options, load, save, reset }
})
