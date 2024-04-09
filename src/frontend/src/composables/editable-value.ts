import { computed, type Ref } from 'vue'

export function arrayEditableValue(source: Ref<any[] | undefined>) {
  return computed({
    get(): string {
      return (source.value || []).join(',')
    },
    set(newValue: string) {
      source.value = newValue.split(',')
    },
  })
}

export function numericEditableValue(source: Ref<number | undefined>) {
  return computed({
    get() {
      if (source.value === undefined) return ''
      else return String(source.value)
    },
    set(newValue: string) {
      if (newValue.length === 0) source.value = undefined
      else source.value = parseInt(newValue)
    },
  })
}

export function stringEditableValue(source: Ref<string | number | undefined>) {
  return computed({
    get() {
      if (source.value === undefined) return ''
      else return String(source.value)
    },
    set(newValue: string) {
      if (newValue.length === 0) source.value = undefined
      else source.value = newValue
    },
  })
}
