# H3 + Zod 验证指南

## 验证工具

使用 `h3-zod` 集成进行类型安全的请求验证：

```typescript
// server/utils/use-safe-validate.ts
import { getValidatedQuery, getValidatedRouterParams, readValidatedBody } from 'h3'
import { z } from 'zod'

export async function useSafeBody<T extends z.ZodTypeAny>(event: H3Event, schema: T) {
  const result = await readValidatedBody(event, data => schema.parse(data))
  return result
}

export async function useSafeQuery<T extends z.ZodTypeAny>(event: H3Event, schema: T) {
  const result = await getValidatedQuery(event, data => schema.parse(data))
  return result
}

export async function useSafeParams<T extends z.ZodTypeAny>(event: H3Event, schema: T) {
  const result = await getValidatedRouterParams(event, data => schema.parse(data))
  return result
}
```

## 定义验证 Schema

```typescript
// server/utils/validate-tts.ts
import { z } from 'zod'

export const WordIdSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const AccentSchema = z.object({
  accent: z.enum(['uk', 'us']).default('uk'),
})
```

## 使用示例

```typescript
// server/api/tts/words/[id].get.ts
import { useSafeParams, useSafeQuery } from '@/server/utils/use-safe-validate'
import { AccentSchema, WordIdSchema } from '@/server/utils/validate-tts'

export default defineEventHandler(async (event) => {
  const { id } = await useSafeParams(event, WordIdSchema)
  const { accent } = await useSafeQuery(event, AccentSchema)
  // ...
})
```
