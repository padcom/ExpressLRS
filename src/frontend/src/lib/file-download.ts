export function downloadBlob(filename: string, blob: Blob) {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
