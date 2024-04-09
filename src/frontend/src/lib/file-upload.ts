import { getBaseURL } from './http-client'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export type ProgressCallback = (
  this: XMLHttpRequestUpload,
  ev: ProgressEvent<XMLHttpRequestEventTarget>
) => any

function parseResponse<T>(s: string) {
  try {
    return JSON.parse(s) as T
  } catch {
    return s as T
  }
}

export function uploadFile<T = string>(
  url: string,
  method: 'PUT' | 'POST',
  file: File,
  onProgress: ProgressCallback = noop,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', onProgress, { once: false })
    xhr.addEventListener('load', () => resolve(parseResponse<T>(xhr.responseText)), { once: true })
    xhr.addEventListener('error', () => reject(parseResponse<T>(xhr.responseText)), { once: true })
    xhr.addEventListener('abort', () => reject(parseResponse<T>(xhr.responseText)), { once: true })
    xhr.open(method, `${getBaseURL()}${url}`)
    xhr.setRequestHeader('X-FileSize', String(file.size))

    const data = new FormData()
    data.append('upload', file, file.name)
    xhr.send(data)
  })
}
