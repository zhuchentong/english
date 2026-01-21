import { H3Event } from 'h3'

export function createMockEvent(
  url: string,
  params?: Record<string, string>,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
  body?: any,
): H3Event {
  const urlObj = new URL(url)
  const req = new Request(urlObj, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  })
  const event = new H3Event(req, {
    params: params || {},
    ...(params && { context: { params } }),
  })
  return event
}
