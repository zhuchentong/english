<script setup lang="ts">
/**
 * @file Dashboard 首页
 * @description 网站数据概览页面，展示单词数量和单词书数量统计
 */

const { data: stats, pending } = await useFetch('/api/stats')

const wordCount = computed(() => stats.value?.wordCount ?? 0)
const bookCount = computed(() => stats.value?.bookCount ?? 0)
</script>

<template>
  <div class="mx-auto max-w-5xl p-6">
    <h1 class="mb-6 text-2xl text-gray-800 font-bold">
      数据概览
    </h1>

    <t-space size="large">
      <t-card class="w-72">
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 flex-center rounded-lg bg-primary/10">
            <t-icon name="book" size="28" class="text-primary" />
          </div>
          <div>
            <div class="text-sm text-gray-600">
              单词数量
            </div>
            <div v-if="pending" class="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div v-else class="mt-1 text-2xl text-gray-800 font-bold">
              {{ wordCount }}
            </div>
          </div>
        </div>
      </t-card>

      <t-card class="w-72">
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 flex-center rounded-lg bg-green-100">
            <t-icon name="books" size="28" class="text-green-600" />
          </div>
          <div>
            <div class="text-sm text-gray-600">
              单词书数量
            </div>
            <div v-if="pending" class="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div v-else class="mt-1 text-2xl text-gray-800 font-bold">
              {{ bookCount }}
            </div>
          </div>
        </div>
      </t-card>
    </t-space>
  </div>
</template>
