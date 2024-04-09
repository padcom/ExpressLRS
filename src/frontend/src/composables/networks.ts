/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
import { ref } from 'vue'
import { singleton } from '@/lib/singleton'
import { http } from '@/lib/http-client'
import { sleep } from '@/lib/sleep'

export const useNetworks = singleton(() => {
  const networks = ref<string[]>([])
  const loading = ref(false)

  async function load() {
    if (loading.value) return

    loading.value = true

    while (true) {
      try {
        const response = await http(`/networks.json`)
        if (response.ok && response.status === 200) {
          networks.value = await response.json()
          break
        }
      } catch (e) {
        // skip errors, we'll try again
      }

      await sleep(2000)
    }

    // eslint-disable-next-line require-atomic-updates
    loading.value = false
  }

  return { networks, load, loading }
})
