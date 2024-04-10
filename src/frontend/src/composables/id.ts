import { v4 as uuid } from 'uuid'
import { computed } from 'vue'

export function uniqueId() {
  return computed(() => uuid())
}
