export interface Pagination {
  current: number
  pageIndex: number
  pageSize: number
  total: number
  pageTotal: number
}

export function usePage(pageIndex: number = 0, pageSize: number = 10) {
  const data = ref({
    total: 0,
    pageIndex,
    pageSize,
    pageTotal: 0,
  })

  const pagination = computed(() => ({
    current: data.value.pageIndex + 1,
    pageIndex: data.value.pageIndex,
    pageSize: data.value.pageSize,
    total: data.value.total,
    pageTotal: data.value.pageTotal,
  }))

  return {
    updatePage(response: Partial<{ pageIndex: number, pageSize: number, total: number, pageTotal?: number }>) {
      data.value.pageIndex = response.pageIndex ?? data.value.pageIndex
      data.value.pageSize = response.pageSize ?? data.value.pageSize
      data.value.total = response.total ?? data.value.total
      data.value.pageTotal = response.pageTotal ?? Math.ceil(data.value.total / data.value.pageSize)
    },
    pagination,
  }
}
