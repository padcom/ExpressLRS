import { computed } from 'vue'

export function uniqueId() {
  return computed(() => crypto.randomUUID())
}
