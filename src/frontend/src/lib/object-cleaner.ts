export function cleanupObjectFromUndefined<T extends object>(obj: T): T {
  const isSet = (value: any) => value !== undefined

  return Object.fromEntries(Object.entries(obj).filter(([, value]) => isSet(value))) as T
}
