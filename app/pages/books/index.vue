<script setup lang="ts">
import type { PageInfo } from 'tdesign-vue-next'

const router = useRouter()
const { pagination, updatePage } = usePage(0, 10)
const { data: books, pending } = await useBook(pagination)

function onPageChange(pageInfo: PageInfo) {
  updatePage(pageInfo)
}

function navigateToBook(bookId: number) {
  router.push(`/books/${bookId}`)
}
</script>

<template>
  <div>
    <t-card title="单词书列表">
      <template #actions>
        <t-button theme="primary">
          <template #icon>
            <t-icon name="add" />
          </template>
          新建单词书
        </t-button>
      </template>

      <t-space direction="vertical" size="large" class="w-full">
        <div v-if="pending" class="flex justify-center py-8">
          <t-loading size="large" />
        </div>

        <template v-else-if="books.length > 0">
          <t-card
            v-for="book in books"
            :key="book.id"
            :title="book.name"
            class="cursor-pointer transition-shadow hover:shadow-lg"
            @click="navigateToBook(book.id)"
          >
            <div class="flex items-center justify-between">
              <div>
                <div v-if="book.description" class="text-gray-600">
                  {{ book.description }}
                </div>
                <div class="mt-2 text-sm text-gray-400">
                  单词数量: {{ book.wordCount }}
                </div>
              </div>
              <t-icon name="chevron-right" class="text-gray-400" />
            </div>
          </t-card>

          <div v-if="pagination.pageTotal > 0" class="flex justify-center pt-4">
            <t-pagination
              v-model:current="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :page-size-options="[10, 20, 50]"
              show-jumper
              @change="onPageChange"
            />
          </div>
        </template>

        <t-empty v-else description="暂无单词书" />
      </t-space>
    </t-card>
  </div>
</template>
