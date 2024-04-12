export function readBits(value: number, start: number, length: number) {
  return (value >> start) & ((1 << length) - 1)
}

export function updateBits(oldValue: number, newValue: number, start: number, length: number) {
  return (oldValue & (0x7fffffff & ~(((1 << length) - 1) << start))) | (newValue << start)
}
