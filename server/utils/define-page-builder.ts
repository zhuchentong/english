import type { H3Event } from 'h3'
import { getValidatedQuery } from 'h3'
import { z } from 'zod'

export interface PageBuilderOptions {
  pageIndex: number
  pageSize: number
}

const PageLikeSchema = z.object({
  pageIndex: z.coerce.number().int().min(0),
  pageSize: z.coerce.number().int().min(1).max(100),
})

async function getPageBuilderOptions(event: H3Event | PageBuilderOptions): Promise<PageBuilderOptions> {
  if ('pageIndex' in event && 'pageSize' in event) {
    return event as PageBuilderOptions
  }
  else {
    const { pageIndex, pageSize } = await getValidatedQuery(event, PageLikeSchema)
    return {
      pageIndex,
      pageSize,
    } as PageBuilderOptions
  }
}

class PageBuilder {
  constructor(private readonly options: PageBuilderOptions) {}

  toPageArgs() {
    return {
      skip: this.options.pageIndex * this.options.pageSize,
      take: this.options.pageSize,
    }
  }

  toPageResponse<T>(content: T[], total: number) {
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
  const options = await getPageBuilderOptions(event)
  return new PageBuilder(options)
}
