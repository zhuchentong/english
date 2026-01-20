<script setup lang="ts">
import type { Prisma } from '@prisma/client'
import type { PageInfo } from 'tdesign-vue-next'

type Book = Prisma.BookGetPayload<{
  select: {
    id: true
    name: true
    description: true
    wordCount: true
    isPublic: true
    createdAt: true
  }
}>

const route = useRoute()
const router = useRouter()
const bookId = computed(() => Number(route.params.id))

const { pagination, updatePage } = usePage(0, 9)
const { data: words, pending: wordsPending } = await useWord({
  bookId: bookId.value!,
  pagination,
})

const { data: book, pending: bookPending, error: bookError }
  = useFetch<Book>(() => `/api/books/${bookId.value}`)

const currentBook = computed(() => book.value)

function onPageChange(pageInfo: PageInfo) {
  updatePage(pageInfo)
}

function goBack() {
  router.push('/books')
}

async function playPronunciation(wordId: number, accent: 'uk' | 'us') {
  try {
    const response = await fetch(`/api/tts/words/${wordId}?accent=${accent}`)
    if (!response.ok) {
      throw new Error('Failed to fetch audio')
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.play()
    audio.onended = () => URL.revokeObjectURL(url)
  }
  catch (error) {
    console.error('Failed to play pronunciation:', error)
  }
}
</script>

<template>
  <div>
    <t-card title="单词书详情">
      <template #actions>
        <t-button theme="default" @click="goBack">
          <template #icon>
            <t-icon name="arrow-left" />
          </template>
          返回列表
        </t-button>
      </template>

      <div v-if="bookError" class="flex flex-col items-center justify-center py-12">
        <t-empty type="fail" title="未找到该单词书" description="该单词书可能已被删除或不存在">
          <template #action>
            <t-button theme="primary" @click="goBack">
              返回列表
            </t-button>
          </template>
        </t-empty>
      </div>

      <template v-else>
        <div v-if="bookPending" class="flex justify-center py-8">
          <t-loading size="large" />
        </div>

        <div v-else-if="currentBook" class="mb-6">
          <h2 class="mb-2 text-xl font-bold">
            {{ currentBook.name }}
          </h2>
          <div v-if="currentBook.description" class="mb-2 text-gray-600">
            {{ currentBook.description }}
          </div>
          <div class="text-sm text-gray-400">
            单词总数: {{ currentBook.wordCount }}
          </div>
        </div>

        <t-divider />

        <div class="mb-4">
          <h3 class="text-lg font-medium">
            单词列表
          </h3>
        </div>

        <t-table
          :loading="wordsPending"
          :data="words"
          :columns="[
            { colKey: 'word', title: '单词', width: 150 },
            { colKey: 'phoneticUK', title: '英式音标', width: 150 },
            { colKey: 'phoneticUS', title: '美式音标', width: 150 },
            { colKey: 'definition', title: '释义' },
            { colKey: 'difficulty', title: '难度', width: 100 },
          ]"
          row-key="itemId"
          hover
        >
          <template #word="{ row }">
            <span class="font-medium">{{ row.word }}</span>
          </template>
          <template #phoneticUK="{ row }">
            <t-button v-if="row.phoneticUK" type="text" @click="playPronunciation(row.id, 'uk')">
              {{ row.phoneticUK }}
            </t-button>
            <span v-else class="text-gray-300">-</span>
          </template>
          <template #phoneticUS="{ row }">
            <t-button v-if="row.phoneticUS" type="text" @click="playPronunciation(row.id, 'us')">
              {{ row.phoneticUS }}
            </t-button>
            <span v-else class="text-gray-300">-</span>
          </template>
          <template #difficulty="{ row }">
            <t-tag :theme="row.difficulty <= 2 ? 'success' : row.difficulty <= 4 ? 'warning' : 'danger'">
              {{ row.difficulty }}
            </t-tag>
          </template>
        </t-table>

        <t-empty v-if="words.length === 0" description="该单词书暂无单词" />
        <div v-if="pagination.pageTotal > 1" class="flex justify-center pt-4">
          <t-pagination
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            show-jumper
            @change="onPageChange"
          />
        </div>
      </template>
    </t-card>
  </div>
</template>
