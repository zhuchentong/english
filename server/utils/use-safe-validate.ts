import type { H3Event } from 'h3'
import type { z } from 'zod'
import { getValidatedQuery, getValidatedRouterParams, readValidatedBody } from 'h3'

export async function useSafeBody<T extends z.ZodTypeAny>(event: H3Event, schema: T): Promise<z.infer<T>> {
  const result = await readValidatedBody(event, data => schema.parse(data))
  return result
}

export async function useSafeQuery<T extends z.ZodTypeAny>(event: H3Event, schema: T): Promise<z.infer<T>> {
  const result = await getValidatedQuery(event, data => schema.parse(data))
  return result
}

export async function useSafeParams<T extends z.ZodTypeAny>(event: H3Event, schema: T): Promise<z.infer<T>> {
  const result = await getValidatedRouterParams(event, data => schema.parse(data))
  return result
}
