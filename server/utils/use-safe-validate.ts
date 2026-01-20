import type { H3Event } from 'h3'
import type { z } from 'zod'
import { getValidatedQuery, getValidatedRouterParams, readValidatedBody } from 'h3'

export async function useSafeBody<T>(event: H3Event, schema: z.ZodTypeAny): Promise<T> {
  const result = await readValidatedBody(event, schema)
  return result
}

export async function useSafeQuery<T>(event: H3Event, schema: z.ZodTypeAny): Promise<T> {
  const result = await getValidatedQuery(event, schema)
  return result
}

export async function useSafeParams<T>(event: H3Event, schema: z.ZodTypeAny): Promise<T> {
  const result = await getValidatedRouterParams(event, schema)
  return result
}
