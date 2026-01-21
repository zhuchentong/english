import type { H3Event } from 'h3'

/**
 * 创建模拟 H3 事件对象用于 unit 测试
 * @param url - 请求 URL
 * @param options - 可选的请求配置
 * @param options.method - HTTP 请求方法，默认 'GET'
 * @param options.body - 请求体数据
 * @param options.query - URL 查询参数
 * @returns 模拟的 H3Event 对象
 */
export function createMockEvent(
  url: string,
  options?: { method?: string, body?: any, query?: any },
): H3Event {
  return {
    node: { req: { url, method: options?.method || 'GET' }, res: {} },
    context: {},
    path: url,
    method: options?.method || 'GET',
    query: options?.query || {},
    body: options?.body,
  } as unknown as H3Event
}
