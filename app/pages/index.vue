<template>
  <div class="p-6 max-w-5xl mx-auto">
    <t-space direction="vertical" size="large">
      <t-card title="TDesign 集成示例">
        <t-space>
          <t-button theme="primary">主要按钮</t-button>
          <t-button theme="default">默认按钮</t-button>
          <t-button theme="default" variant="outline">轮廓按钮</t-button>
          <t-button theme="default" variant="dashed">虚线按钮</t-button>
        </t-space>
      </t-card>

      <t-alert theme="success" message="TDesign 已成功集成到项目中！" />

      <t-card title="UnoCSS 集成示例">
        <t-space direction="vertical">
          <div class="flex gap-4">
            <div class="w-16 h-16 bg-red-500 rounded-lg"></div>
            <div class="w-16 h-16 bg-blue-500 rounded-full"></div>
            <div class="w-16 h-16 bg-green-500 border-2 border-gray-300"></div>
          </div>
          
          <div class="text-xl font-bold text-gray-800 mt-4">原子化 CSS 示例</div>
          <div class="text-sm text-gray-600">使用 UnoCSS 快速构建样式</div>
          
          <div class="flex-center p-4 bg-gray-100 rounded mt-2">
            <span class="text-primary-600">Flex 居中对齐</span>
          </div>
        </t-space>
      </t-card>
    </t-space>
  </div>
</template>
