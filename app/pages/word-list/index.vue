<template>
  <div>
    <t-card title="单词列表">
      <template #actions>
        <t-space>
          <t-button theme="default" variant="outline">
            <template #icon>
              <t-icon name="filter" />
            </template>
            筛选
          </t-button>
          <t-button theme="primary">
            <template #icon>
              <t-icon name="add" />
            </template>
            添加单词
          </t-button>
        </t-space>
      </template>

      <t-space direction="vertical" size="large" class="w-full">
        <t-alert theme="info" message="这里是单词列表页面示例" />

        <t-table
          row-key="id"
          :columns="columns"
          :data="words"
          :hover="true"
          :stripe="true"
          size="medium"
        />

        <t-pagination
          v-model="current"
          :total="total"
          :page-size.sync="pageSize"
          @change="onPageChange"
        />
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
interface Word {
  id: number
  word: string
  phonetic: string
  definition: string
  difficulty: number
}

const columns = [
  {
    colKey: 'word',
    title: '单词',
    width: 150,
  },
  {
    colKey: 'phonetic',
    title: '音标',
    width: 120,
  },
  {
    colKey: 'definition',
    title: '释义',
  },
  {
    colKey: 'difficulty',
    title: '难度',
    width: 100,
    cell: (h: any, { row }: { row: Word }) => {
      const difficultyMap: Record<number, string> = {
        1: '简单',
        2: '中等',
        3: '困难',
      }
      return difficultyMap[row.difficulty] || '-'
    },
  },
]

const words = ref<Word[]>([
  {
    id: 1,
    word: 'abandon',
    phonetic: '/əˈbændən/',
    definition: 'v. 抛弃，遗弃；放弃',
    difficulty: 2,
  },
  {
    id: 2,
    word: 'ability',
    phonetic: '/əˈbɪləti/',
    definition: 'n. 能力；本领；才能',
    difficulty: 1,
  },
  {
    id: 3,
    word: 'abnormal',
    phonetic: '/æbˈnɔːml/',
    definition: 'adj. 反常的；不正常的',
    difficulty: 2,
  },
  {
    id: 4,
    word: 'aboard',
    phonetic: '/əˈbɔːrd/',
    definition: 'adv. 在船(车、飞机)上',
    difficulty: 1,
  },
  {
    id: 5,
    word: 'abolish',
    phonetic: '/əˈbɑːlɪʃ/',
    definition: 'v. 废除；取消',
    difficulty: 3,
  },
])

const current = ref(1)
const total = computed(() => words.value.length)
const pageSize = ref(10)

const onPageChange = (pageInfo: any) => {
  current.value = pageInfo.current
}
</script>
