<script setup lang="ts">
import type { PageInfo } from 'tdesign-vue-next'

const router = useRouter()
const { books, booksPending, refreshBooks } = useBook()
const currentPage = ref(1)
const pageSize = ref(10)

function handlePageChange(page: PageInfo) {
  currentPage.value = page.current
  refreshBooks()
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
        <div v-if="booksPending" class="flex justify-center py-8">
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

          <div v-if="books.length > 0" class="flex justify-center pt-4">
            <t-pagination
              v-model:current="currentPage"
              v-model:page-size="pageSize"
              :total="books.length"
              :page-size-options="[10, 20, 50]"
              show-jumper
              @change="handlePageChange"
            />
          </div>
        </template>

        <t-empty v-else description="暂无单词书" />
      </t-space>
    </t-card>
  </div>
</template>
