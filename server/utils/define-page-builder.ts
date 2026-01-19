import type { H3Event } from 'h3'
import { z } from 'h3-zod'
import { useSafeQuery } from './use-safe-validate'

export interface PageBuilderOptions {
  pageIndex: number
  pageSize: number
}

const PageLikeSchema = z.object({
  pageIndex: z.coerce.number().int().min(0),
  pageSize: z.coerce.number().int().min(1).max(100),
})

async function getPageBulderOptions(event: H3Event | PageBuilderOptions): Promise<PageBuilderOptions> {
  if ('pageIndex' in event && 'pageSize' in event) {
    return event as PageBuilderOptions
  }
  else {
    const { pageIndex, pageSize } = await useSafeQuery(event, PageLikeSchema)
    return {
      pageIndex,
      pageSize,
    } as PageBuilderOptions
  }
}

class PageBuilder {
  constructor(private readonly options: PageBuilderOptions) {}

  toPageArgs(): any {
    return {
      skip: this.options.pageIndex * this.options.pageSize,
      take: this.options.pageSize,
    }
  }

  toPageRespnose<T>(content: T[], total: number) {
    return {
      content,
      pageIndex: this.options.pageIndex,
      pageSize: this.options.pageSize,
      pageTotal: Math.ceil(total / this.options.pageSize),
      total,
    }
  }
}

export async function definePageBuilder(event: H3Event | PageBuilderOptions) {
  // 获取分页选项
  const options = await getPageBulderOptions(event)

  // 创建并返回 PageBuilder 实例
  return new PageBuilder(options)
}
