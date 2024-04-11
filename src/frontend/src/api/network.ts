import { http } from '@/lib/http-client'
import { API } from './api'
import { sleep } from '@/lib/sleep'

export class NetworksAPI extends API {
  // eslint-disable-next-line complexity
  async load() {
    while (true) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await http(`/networks.json`)
        // eslint-disable-next-line max-depth
        if (response.ok && response.status === 200) {
          return response.json()
        }
      } catch (e) {
        // skip errors, we'll try again
      }

      // eslint-disable-next-line no-await-in-loop
      await sleep(2000)
    }
  }
}

