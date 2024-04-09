export function singleton<T>(composable: (...args: any[]) => T) {
  let instance: T

  return (...args: any[]) => {
    if (!instance) instance = composable(...args)

    return instance
  }
}
