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
        <t-alert theme="info" message="这里是单词书列表页面示例" />

        <t-card v-for="book in wordBooks" :key="book.id" :title="book.name" class="cursor-pointer hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-gray-600">{{ book.description }}</div>
              <div class="text-sm text-gray-400 mt-2">单词数量: {{ book.wordCount }}</div>
            </div>
            <t-icon name="chevron-right" class="text-gray-400" />
          </div>
        </t-card>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface WordBook {
  id: number
  name: string
  description: string
  wordCount: number
}

const wordBooks = ref<WordBook[]>([
  {
    id: 1,
    name: 'CET-4 核心词汇',
    description: '大学英语四级核心词汇，共2000词',
    wordCount: 2000,
  },
  {
    id: 2,
    name: 'CET-6 核心词汇',
    description: '大学英语六级核心词汇，共2500词',
    wordCount: 2500,
  },
  {
    id: 3,
    name: '雅思高频词汇',
    description: '雅思考试高频词汇，共3000词',
    wordCount: 3000,
  },
])
</script>
