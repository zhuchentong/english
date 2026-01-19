# Prisma 数据库层

**用途**: 数据库架构、种子脚本和迁移工具

## 概述
英语单词学习系统的数据库架构、数据导入和管理工具。

## 目录结构
```
prisma/
├── schema.prisma          # 10 个模型，词汇管理架构
├── seed.ts                # CSV 导入器 + JSON 解析逻辑
└── reset.ts               # 数据库清空工具
```

## 快速定位
| 任务 | 位置 | 说明 |
|------|----------|-------|
| 架构模型 | `schema.prisma` | User, Word, Definition, ExampleSentence, UserWord 等 |
| CSV 导入 | `seed.ts` | 解析 words/新概念英语第一册.csv (JSON 字段) |
| 数据库重置 | `reset.ts` | 通过 deleteMany 清空所有表 |

## 约定规范

### 架构模型
- 10 个模型分 3 大类: 用户管理、单词管理、用户学习
- 所有外键级联删除 (onDelete: Cascade)
- 索引字段: word, difficulty, userId, wordId, nextReviewAt
- 唯一约束: User.email, Word.word, UserWord(userId, wordId)

### CSV 数据格式
- `phonetic`: JSON 对象 `{uk: "...", us: "..."}`
- `sentence`: JSON 数组 `[{cn_sentence: "...", origin_sentence: "..."}]`
- `translation`: 分号分隔，带词性前缀 (如: "v.原谅；n.借口")
- CSV 字段中的双引号需转义

### 种子导入流程
- 运行器: `tsx prisma/seed.ts` (直接执行 TypeScript)
- 数据源: `words/新概念英语第一册.csv`
- 自动创建系统用户和单词本
- 解析多部分定义和每个单词的多个例句

### 迁移策略
- 开发环境: `pnpm prisma:push` (无迁移文件)
- 生产环境: `pnpm prisma:migrate` (版本化迁移)

### 连接模式
- 使用 `@prisma/adapter-pg` + 显式 `Pool` 实例
- 与 server/utils/db.ts 中的单例模式一致

## 反模式 (禁止行为)
- ❌ Prisma 操作使用 `any` 类型 (seed.ts:266, reset.ts:40 需修复)
- ❌ 提交 `prisma/migrations/` 直到生产就绪 (开发用 push)
- ❌ 创建后手动编辑迁移文件
- ❌ 在生产环境运行 seed 脚本 (使用适当的数据管理)
- ❌ 重复数据库清空逻辑 (seed.ts:271-280 和 reset.ts:13-22 重复)
