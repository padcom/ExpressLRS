export function getBaseURL() {
  const params = new URLSearchParams(window.location.search)

  return params.get('base-url') || ''
}

export async function http(url: string | URL | Request, options?: RequestInit) {
  try {
    return await fetch(`${getBaseURL()}${url}`, options)
  } catch (e: any) {
    return {
      ok: false,
      type: 'error',
      status: 500,
      statusText: e.message || e,
    } as Response
  }
}
