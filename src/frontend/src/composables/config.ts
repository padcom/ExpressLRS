import { ref } from 'vue'

import type { Config } from '@/types'
import { singleton } from '@/lib/singleton'
import { useOptions } from './options'
import { ConfigAPI } from '@/api'

// eslint-disable-next-line max-lines-per-function
export const useConfig = singleton(() => {
  const config = ref<Config>()
  const originalUID = ref<number[]>([])
  const originalUIDType = ref<string>('Flashed')

  async function load() {
    const response = await new ConfigAPI().load()

    if (response.ok) {
      config.value = await response.json()
      originalUID.value = config.value?.config.uid || []
      originalUIDType.value = config.value?.config.uidtype || 'Flashed'
      const { options } = useOptions()
      options.value = config.value?.options
    } else {
      config.value = undefined
    }
  }

  async function download() {
    const response = await new ConfigAPI().download()

    if (response.ok) {
      return {
        status: 'ok',
        data: await response.blob(),
        msg: 'Download completed',
      }
    } else {
      return {
        status: 'error',
        data: null,
        msg: response.statusText,
      }
    }
  }

  return { config, load, download, originalUID, originalUIDType }
})
