<template>
  <div class="mx-auto max-w-5xl p-6">
    <t-space direction="vertical" size="large">
      <t-card title="TDesign 集成示例">
        <t-space>
          <t-button theme="primary">
            主要按钮
          </t-button>
          <t-button theme="default">
            默认按钮
          </t-button>
          <t-button theme="default" variant="outline">
            轮廓按钮
          </t-button>
          <t-button theme="default" variant="dashed">
            虚线按钮
          </t-button>
        </t-space>
      </t-card>

      <t-alert theme="success" message="TDesign 已成功集成到项目中！" />

      <t-card title="UnoCSS 集成示例">
        <t-space direction="vertical">
          <div class="flex gap-4">
            <div class="h-16 w-16 rounded-lg bg-red-500" />
            <div class="h-16 w-16 rounded-full bg-blue-500" />
            <div class="h-16 w-16 border-2 border-gray-300 bg-green-500" />
          </div>

          <div class="mt-4 text-xl text-gray-800 font-bold">
            原子化 CSS 示例
          </div>
          <div class="text-sm text-gray-600">
            使用 UnoCSS 快速构建样式
          </div>

          <div class="mt-2 flex-center rounded bg-gray-100 p-4">
            <span class="text-primary-600">Flex 居中对齐</span>
          </div>
        </t-space>
      </t-card>
    </t-space>
  </div>
</template>
