/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
import { ref } from 'vue'
import { singleton } from '@/lib/singleton'
import { NetworksAPI } from '@/api'

export const useNetworks = singleton(() => {
  const networks = ref<string[]>([])
  const loading = ref(false)

  async function load() {
    if (loading.value) return

    loading.value = true

    try {
      await new NetworksAPI().load()
    } finally {
      // eslint-disable-next-line require-atomic-updates
      loading.value = false
    }
  }

  return { networks, load, loading }
})
