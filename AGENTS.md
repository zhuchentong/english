# 项目知识库 - 英语单词管理工具

**生成时间:** 2026-01-16
**框架:** Nuxt 4.2.2 (Vue 3.5.26)
**类型:** 英语词汇管理系统（开发中）

## 概述
基于 Nuxt 4 构建的英语单词管理工具，旨在帮助用户学习、记忆和管理英语词汇。当前项目处于最小化启动模板状态，基础架构已搭建完成，待开发实际的单词管理功能。

## 项目状态

### 当前状态（已实现）
✅ **框架基础设施** - Nuxt 4.2.2 + Vue 3.5.26 + TypeScript
✅ **数据库层** - Prisma 7.2.0 + PostgreSQL 连接配置
✅ **开发环境** - ESLint 9、TypeScript 配置、pnpm 包管理
✅ **API 结构** - 服务端路由框架已就绪

### 待开发功能（计划中）
📝 **词汇 CRUD API** - 增删改查接口
📝 **用户界面组件** - 单词列表、单词卡片、添加表单等
📝 **学习功能** - 闪卡系统、间隔重复算法、进度追踪
📝 **认证系统** - 用户登录、权限管理

## 目录结构
```
./
├── app/
│   ├── app.vue              # 根组件（当前为 NuxtWelcome 占位）
│   ├── components/          # Vue 组件（待添加）
│   ├── composables/         # 组合式函数（待添加）
│   ├── pages/               # 页面路由（待添加）
│   └── layouts/             # 布局组件（待添加）
│   └── [generated/prisma/]  # Prisma Client 输出（自动生成）
├── server/
│   ├── api/
│   │   └── users.get.ts     # API 路由示例（待替换为单词相关 API）
│   └── utils/
│       └── db.ts           # Prisma Client 单例（自动导入）
├── prisma/
│   ├── schema.prisma         # 数据库模型定义（当前为 User/Post，待更新为 Word 模型）
│   └── migrations/          # 数据库迁移文件（待添加）
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts           # 主配置（最小化）
├── eslint.config.mjs        # ESLint 9 扁平配置
├── tsconfig.json            # TS 配置（引用 .nuxt）
├── package.json             # pnpm, nuxt 4.2.2
└── .env                     # 环境变量（待创建，需要 DATABASE_URL）
```

## 快速定位
| 任务 | 位置 | 说明 |
|------|----------|-------|
| 应用入口 | `app/app.vue` | 根组件，当前为 NuxtWelcome 占位 |
| 数据库模型 | `prisma/schema.prisma` | 当前为 User/Post 模型，待更新为 Word 相关模型 |
| API 路由 | `server/api/` | 当前仅有 users.get.ts 示例 |
| 数据库客户端 | `server/utils/db.ts` | Prisma Client 单例，全局自动导入 |
| 配置 | `nuxt.config.ts` | 仅 @nuxt/eslint 模块 |
| 代码检查 | `eslint.config.mjs` | 扩展 .nuxt/eslint.config.mjs |
| 静态资源 | `public/` | favicon, robots.txt |

## 数据库架构

### 用户模型（User）
```prisma
model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique
  name      String?
  password  String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  userWords   UserWord[]
  wordLists   WordList[]
  favorites   Favorite[]
}
```

### 单词管理模型

#### Word（单词）
```prisma
model Word {
  id          Int        @id @default(autoincrement())
  word        String     @unique  // 单词拼写
  phonetic    Json?              // 音标：{"uk": "/.../", "us": "/.../"}
  difficulty  Int        @default(1) // 难度等级：1-5
  viewCount   Int        @default(0) // 查看次数
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  definitions Definition[]
  examples   ExampleSentence[]
  tags       WordTag[]
  userWords  UserWord[]
  favorites  Favorite[]
  wordLists  WordListItem[]
}
```

#### Definition（定义）
```prisma
model Definition {
  id            Int      @id @default(autoincrement())
  wordId        Int
  partOfSpeech  String?  // 词性：n., v., adj., adv., etc.
  translation   String?  // 中文翻译/释义
  englishDef    String?  // 英文释义
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  word  Word   @relation(fields: [wordId], references: [id], onDelete: Cascade)
}
```

#### ExampleSentence（例句）
```prisma
model ExampleSentence {
  id             Int      @id @default(autoincrement())
  wordId         Int
  cnSentence     String?  // 中文例句
  originSentence String?  // 英文例句
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)
}
```

#### Tag（标签）
```prisma
model Tag {
  id          Int        @id @default(autoincrement())
  name        String     @unique  // 标签名称
  description String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  words WordTag[]
}
```

#### WordTag（单词-标签关联）
```prisma
model WordTag {
  wordId Int
  tagId  Int

  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([wordId, tagId])
}
```

### 用户学习模型

#### UserWord（用户单词记录）
```prisma
model UserWord {
  id             Int        @id @default(autoincrement())
  userId         Int
  wordId         Int
  masteryLevel   Int        @default(0) // 掌握程度：0-5
  reviewCount    Int        @default(0) // 复习次数
  lastReviewAt   DateTime?
  nextReviewAt   DateTime?
  isFavorite     Boolean    @default(false)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)

  @@unique([userId, wordId])
}
```

#### WordList（单词本）
```prisma
model WordList {
  id          Int        @id @default(autoincrement())
  userId      Int
  name        String     // 单词本名称
  description String?    // 描述
  isPublic    Boolean    @default(false) // 是否公开
  wordCount   Int        @default(0) // 单词数量
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  user    User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items   WordListItem[]
}
```

#### WordListItem（单词本条目）
```prisma
model WordListItem {
  id        Int      @id @default(autoincrement())
  wordListId Int
  wordId     Int
  addedAt    DateTime @default(now())

  wordList WordList @relation(fields: [wordListId], references: [id], onDelete: Cascade)
  word     Word     @relation(fields: [wordId], references: [id], onDelete: Cascade)

  @@unique([wordListId, wordId])
}
```

#### Favorite（收藏）
```prisma
model Favorite {
  id        Int      @id @default(autoincrement())
  userId    Int
  wordId    Int
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)

  @@unique([userId, wordId])
}
```

### 数据结构说明

#### CSV 数据映射
从提供的 CSV 数据结构到数据库模型的映射：

| CSV 字段 | 数据库模型 | 字段 | 说明 |
|---------|-----------|------|------|
| `word` | `Word` | `word` | 单词拼写（唯一） |
| `translation` | `Definition` | `translation` | 中文翻译/释义 |
| - | `Definition` | `partOfSpeech` | 词性（从 translation 提取） |
| `phonetic` | `Word` | `phonetic` | 音标（JSON 格式） |
| `sentence` | `ExampleSentence` | `originSentence` | 英文例句 |
| - | `ExampleSentence` | `cnSentence` | 中文例句 |

#### 音标数据格式
```json
{
  "uk": "/ɪkˈskjuːz/",
  "us": "/ɪkˈskjuːs/"
}
```

#### 例句数据格式
```json
[
  {
    "cn_sentence": "打扰一下，请问去车站怎么走？",
    "origin_sentence": "Excuse me, could you tell me way to station?"
  }
]
```

## API 路由

### 当前 API 端点
#### GET /api/users
- **功能**: 获取所有用户及其文章（示例接口）
- **请求**: 无需参数
- **响应**:
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-16T00:00:00.000Z",
    "updatedAt": "2026-01-16T00:00:00.000Z",
    "posts": [
      {
        "id": 1,
        "title": "Example Post",
        "content": "Post content",
        "published": false,
        "createdAt": "2026-01-16T00:00:00.000Z",
        "updatedAt": "2026-01-16T00:00:00.000Z",
        "authorId": 1
      }
    ]
  }
]
```

### 计划 API 端点
#### 单词管理
- `GET /api/words` - 获取单词列表（支持分页、搜索、过滤）
- `GET /api/words/:id` - 获取单个单词详情
- `POST /api/words` - 添加新单词
- `PUT /api/words/:id` - 更新单词
- `DELETE /api/words/:id` - 删除单词

#### 学习记录
- `GET /api/words/review` - 获取待复习单词
- `POST /api/words/review/:id` - 提交复习记录
- `POST /api/words/favorite/:id` - 收藏/取消收藏单词

#### 单词本管理
- `GET /api/word-lists` - 获取用户的单词本列表
- `GET /api/word-lists/:id` - 获取单词本详情及单词
- `POST /api/word-lists` - 创建新单词本
- `PUT /api/word-lists/:id` - 更新单词本
- `DELETE /api/word-lists/:id` - 删除单词本
- `POST /api/word-lists/:id/words` - 向单词本添加单词

#### 统计与分析
- `GET /api/stats/overview` - 获取学习概览数据
- `GET /api/stats/progress` - 获取学习进度

## 组件架构

### 当前组件状态
- **app.vue**: 根组件，显示 NuxtWelcome 占位页面

### 待开发组件
#### 核心组件
- `WordCard.vue` - 单词卡片组件
- `WordList.vue` - 单词列表组件
- `WordForm.vue` - 单词添加/编辑表单
- `Flashcard.vue` - 闪卡组件（正面/背面）
- `FlashcardViewer.vue` - 闪卡查看器（支持翻页、标记）

#### 页面组件（待添加到 app/pages/）
- `index.vue` - 首页/仪表盘
- `words/index.vue` - 单词列表页
- `words/[id].vue` - 单词详情页
- `words/add.vue` - 添加单词页
- `review/index.vue` - 复习学习页
- `word-lists/index.vue` - 单词本列表页
- `word-lists/[id].vue` - 单词本详情页

#### 功能组件
- `SearchBar.vue` - 搜索框组件
- `TagFilter.vue` - 标签过滤器
- `Pagination.vue` - 分页组件
- `ProgressBar.vue` - 学习进度条
- `AudioPlayer.vue` - 单词发音播放器

### 组合式函数（待添加到 app/composables/）
- `useWords()` - 单词 CRUD 操作
- `useReview()` - 复习逻辑、间隔重复算法
- `useWordLists()` - 单词本管理
- `useStats()` - 学习统计数据
- `useFavorites()` - 收藏管理

## 约定规范 (Nuxt 4 特有)

### 目录结构
- **app/** (Nuxt 4) - 主应用目录
  - `pages/` - 文件路由（待创建）
  - `components/` - Vue 组件（待创建）
  - `composables/` - 组合式函数（待创建）
  - `layouts/` - 布局组件（待创建）
- **server/** - 服务端代码
  - `api/` - API 路由
  - `middleware/` - 服务端中间件（待创建）
  - `utils/` - 工具函数（当前有 db.ts）

### 配置
- **ESLint 9 扁平配置**: 使用 `withNuxt()` 包装器，扩展 `.nuxt/eslint.config.mjs`
- **TypeScript**: 引用生成的 `.nuxt/tsconfig.*.json` 文件
- **路径别名** (自动配置): `~/`, `@/` → `app/`, `~~/`, `@@/` → 根目录

### 自动导入
- **Nuxt API**: useState, useFetch, definePageMeta 等无需导入
- **组件**: `app/components/` 中的组件创建后自动导入
- **组合式函数**: `app/composables/` 中的函数自动导入
- **服务端工具**: `server/utils/` 中的函数自动导入（Prisma 客户端全局可用）

### 数据库 (Prisma)
- **Provider**: PostgreSQL（需要配置 DATABASE_URL）
- **ORM**: Prisma 7.2.0
- **Prisma Client**: 自动导入，通过 `prisma` 全局可用
- **模式定义**: `prisma/schema.prisma`
- **Client 输出**: `app/generated/prisma/`
- **迁移**: 使用 `pnpm prisma:migrate` 或 `pnpm prisma:push`
- **环境变量**: `DATABASE_URL` 需要在 `.env` 文件中配置

### 包管理器
- **pnpm** (pnpm-lock.yaml v9.0)
- 安装后自动运行: `nuxt prepare`

## 开发工作流

### 首次设置
```bash
# 1. 克隆项目
git clone <repository-url>
cd english

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 DATABASE_URL

# 4. 初始化数据库
pnpm prisma:generate
pnpm prisma:push    # 或 pnpm prisma:migrate

# 5. 启动开发服务器
pnpm dev
```

### 开发命令
```bash
pnpm dev              # 启动开发服务器 (http://localhost:3000)
pnpm build            # 生产环境构建
pnpm preview          # 预览生产环境构建
pnpm generate         # 静态站点生成
```

### 数据库操作
```bash
pnpm prisma:generate  # 生成 Prisma Client
pnpm prisma:push      # 同步 schema 到数据库（无迁移文件）
pnpm prisma:migrate   # 创建并运行迁移
pnpm prisma:studio    # 打开 Prisma Studio GUI
pnpm prisma:seed      # 运行种子数据脚本
```

### 代码检查
```bash
pnpm lint            # 运行 ESLint 检查
pnpm lint:fix        # 自动修复 ESLint 问题
```

## 环境变量

创建 `.env` 文件在项目根目录：

```env
# 数据库连接（必需）
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# 应用配置（可选）
NUXT_PUBLIC_APP_NAME="英语单词管理工具"
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

**重要**: `.env` 文件已在 `.gitignore` 中，不会提交到版本控制。

## 技术栈详情

### 前端
- **框架**: Nuxt 4.2.2（基于 Vue 3.5.26）
- **路由**: Vue Router 4.6.4
- **类型**: TypeScript 5.x
- **代码检查**: ESLint 9.39.2
- **包管理**: pnpm 9.x

### 后端
- **API**: Nuxt Server (H3)
- **数据库**: PostgreSQL
- **ORM**: Prisma 7.2.0

### 开发工具
- **IDE 支持**: Nuxt 自动生成类型定义
- **热重载**: Vite 开发服务器
- **调试**: Vue DevTools 支持

## 常见问题

### 数据库连接失败
确保：
1. `.env` 文件存在并包含有效的 `DATABASE_URL`
2. PostgreSQL 服务正在运行
3. 数据库用户有足够的权限

### Prisma Client 错误
运行以下命令重新生成：
```bash
pnpm prisma:generate
```

### 页面空白或路由不工作
确保：
1. 文件位于 `app/pages/` 目录
2. 文件名遵循 Nuxt 文件路由约定（如 `index.vue`, `[id].vue`）
3. 重启开发服务器

## 下一步开发计划

1. **数据库设计** - 更新 `prisma/schema.prisma`，定义 Word 相关模型
2. **API 开发** - 创建单词管理的 CRUD 端点
3. **用户界面** - 开发核心页面和组件
4. **学习功能** - 实现闪卡系统和间隔重复算法
5. **认证系统** - 集成用户登录和权限管理
6. **测试** - 添加单元测试和端到端测试
7. **部署** - 配置生产环境部署

## 参考资源

- [Nuxt 4 文档](https://nuxt.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
