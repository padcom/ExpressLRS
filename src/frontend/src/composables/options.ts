/* eslint-disable max-lines-per-function */
import { ref } from 'vue'

import type { BuildOptions } from '@/types'
import { singleton } from '@/lib/singleton'
import { http } from '@/lib/http-client'
import { useConfig } from './config'

export const useOptions = singleton(() => {
  const options = ref<BuildOptions>()

  async function load() {
    const response = await http(`/options.json`)
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

    const response = await http(`/options.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...options.value,
        customised: true,
        uid: config.value.config.uid,
      }),
    })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  async function reset() {
    const response = await http(`/reset?options`, { method: 'POST' })

    return {
      status: response.ok ? 'ok' : 'error',
      msg: response.statusText,
    }
  }

  return { options, load, save, reset }
})
