<template>
  <div class="container">
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
    </t-space>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
