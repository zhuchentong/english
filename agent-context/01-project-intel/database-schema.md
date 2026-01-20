# 数据库架构

## 模型概览

项目包含 10 个 Prisma 模型，分为 3 大类：

1. **用户管理**: User
2. **单词管理**: Word, Definition, ExampleSentence, Tag, WordTag
3. **用户学习**: UserWord, Book, BookItem, Favorite

## ER 关系图

```
User ──┬── Book ── BookItem ── Word
       │                 └── (Word 关联)
       ├── UserWord ── Word
       └── Favorite ── Word

Word ──┬── Definition
       ├── ExampleSentence
       └── WordTag ── Tag
```

## 模型详情

### 用户管理

| 模型 | 字段 | 关系 |
|------|------|------|
| User | id, email, name, password | hasMany Book, UserWord, Favorite |

### 单词管理

| 模型 | 字段 | 关系 |
|------|------|------|
| Word | id, word, phoneticUK, phoneticUS, difficulty | hasMany Definition, ExampleSentence, WordTag, UserWord, Favorite, BookItem |
| Definition | id, wordId, partOfSpeech, translation | belongsTo Word |
| ExampleSentence | id, wordId, cnSentence, originSentence | belongsTo Word |
| Tag | id, name, description | hasMany WordTag |
| WordTag | wordId, tagId | belongsTo Word, Tag |

### 用户学习

| 模型 | 字段 | 关系 |
|------|------|------|
| UserWord | id, userId, wordId, masteryLevel, reviewCount | belongsTo User, Word |
| Book | id, userId, name, description, isPublic, wordCount | belongsTo User, hasMany BookItem |
| BookItem | id, bookId, wordId, addedAt | belongsTo Book, Word |
| Favorite | id, userId, wordId, createdAt | belongsTo User, Word |

## 约束与索引

### 唯一约束
- User.email
- Word.word
- UserWord(userId, wordId)
- BookItem(bookId, wordId)
- Favorite(userId, wordId)

### 级联删除
所有外键关系均配置 `onDelete: Cascade`

### 索引字段
- Word.word, Word.difficulty
- UserWord.userId, UserWord.wordId, UserWord.nextReviewAt
- BookItem.bookId, BookItem.wordId
- Favorite.userId, Favorite.wordId
