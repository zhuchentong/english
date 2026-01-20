# English Word Management Tool

A modern English vocabulary management and learning system built with Nuxt 4, Vue 3, and Prisma. Designed to help users effectively learn, remember, and manage English vocabulary through intelligent spaced repetition and interactive flashcards.

## 📋 Project Status

**Current Phase:** Development - Database Schema Complete

### ✅ Completed

- Nuxt 4.2.2 + Vue 3.5.26 + TypeScript setup
- PostgreSQL database with Prisma 7.2.0 ORM
- Development environment configured (ESLint 9, pnpm)
- Database schema designed for vocabulary management (Word, Definition, Example, UserWord, Book, Tag)

### 🚧 In Development

- CRUD operations for word management
- User interface components
- Flashcard system with spaced repetition
- User authentication

### 📅 Planned

- Advanced learning analytics
- Audio pronunciation support
- Import/export vocabulary
- Mobile app development

## 🎯 Features

### Core Functionality

- **Vocabulary Management**
  - Add, edit, and delete words
  - Rich definitions with multiple meanings
  - Example sentences with translations
  - Phonetics and pronunciation guides

- **Learning System**
  - Interactive flashcards with spaced repetition algorithm
  - Progress tracking and mastery levels
  - Review scheduling based on forgetting curves
  - Personalized learning paths

- **Organization**
  - Custom word lists (WordLists)
  - Tag and categorize vocabulary
  - Search and filter functionality
  - Favorites and bookmarking

- **Statistics & Analytics**
  - Learning progress dashboard
  - Review history and trends
  - Performance metrics
  - Word difficulty analysis

## 🛠️ Tech Stack

### Frontend

- **Framework**: Nuxt 4.2.2 (Vue 3.5.26)
- **Language**: TypeScript 5.x
- **Routing**: Vue Router 4.6.4
- **Code Quality**: ESLint 9.39.2
- **Package Manager**: pnpm 9.x

### Backend

- **API**: Nuxt Server (H3)
- **Database**: PostgreSQL
- **ORM**: Prisma 7.2.0
- **Type Safety**: Full TypeScript integration

### Development Tools

- **Hot Reload**: Vite development server
- **Type Generation**: Prisma Client auto-generated types
- **Database GUI**: Prisma Studio
- **Debugging**: Vue DevTools support

## 📁 Project Structure

```
english/
├── app/                          # Nuxt 4 app directory
│   ├── app.vue                   # Root component
│   ├── components/               # Vue components (to be added)
│   ├── composables/              # Vue composables (to be added)
│   ├── pages/                    # File-based routing (to be added)
│   └── layouts/                  # Layout components (to be added)
├── server/                       # Server-side code
│   ├── api/                      # API routes
│   │   └── users.get.ts          # Example endpoint
│   ├── middleware/               # Server middleware (to be added)
│   └── utils/
│       └── db.ts                 # Prisma Client singleton
├── prisma/                       # Database configuration
│   ├── schema.prisma             # Database models
│   └── migrations/               # Database migrations (to be added)
├── public/                       # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── AGENTS.md                     # Project documentation (Chinese)
├── README.md                     # This file
├── eslint.config.js            # ESLint flat configuration
├── nuxt.config.ts               # Nuxt 4 configuration
├── package.json                 # Dependencies & scripts
├── pnpm-lock.yaml              # Lock file
├── pnpm-workspace.yaml         # Workspace configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- pnpm 9.x or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd english
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   # Database connection (required)
   NUXT_DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   ```

   For testing, create a `.env.test` file:

   ```env
   NUXT_DATABASE_URL="postgresql://test_user:test_password@host:port/test_db"
   ```

   **Note**: The `.env` and `.env.test` files are already included in `.gitignore` for security. Nuxt 4 automatically loads `.env` during development and respects the `NUXT_` prefix convention.

4. **Initialize database**

   ```bash
   # Generate Prisma Client
   pnpm prisma:generate

   # Push schema to database (development)
   pnpm prisma:push

   # OR create and run migration (production)
   pnpm prisma:migrate dev --name init
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📖 Database Setup

### Database Schema

The vocabulary management system uses the following models designed for English word learning:

#### User Model

```prisma
model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique
  name      String?
  password  String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  userWords   UserWord[]
  books       Book[]
  favorites   Favorite[]
}
```

#### Word Model

```prisma
model Word {
  id          Int        @id @default(autoincrement())
  word        String     @unique
  phonetic    Json?
  difficulty  Int        @default(1)
  viewCount   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  definitions Definition[]
  examples   ExampleSentence[]
  tags       WordTag[]
  userWords  UserWord[]
  favorites  Favorite[]
  bookItems  BookItem[]
}
```

#### Definition Model

```prisma
model Definition {
  id            Int      @id @default(autoincrement())
  wordId        Int
  partOfSpeech  String?
  translation   String?
  englishDef    String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  word  Word   @relation(fields: [wordId], references: [id], onDelete: Cascade)
}
```

#### ExampleSentence Model

```prisma
model ExampleSentence {
  id             Int      @id @default(autoincrement())
  wordId         Int
  cnSentence     String?
  originSentence String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)
}
```

#### UserWord Model (Learning Progress)

```prisma
model UserWord {
  id             Int        @id @default(autoincrement())
  userId         Int
  wordId         Int
  masteryLevel   Int        @default(0)
  reviewCount    Int        @default(0)
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

#### Book & Tags Models

- **Book**: Custom vocabulary collections
- **Tag**: Categorization system
- **Favorite**: Bookmarked words

### Data Structure

#### CSV Import Format

The system supports importing vocabulary from CSV files with the following structure:

| CSV Column    | Maps To                  | Type       | Description                  |
| ------------- | ------------------------ | ---------- | ---------------------------- |
| `word`        | `Word.word`              | String     | English word                 |
| `translation` | `Definition.translation` | String     | Chinese translation with POS |
| `phonetic`    | `Word.phonetic`          | JSON       | UK/US pronunciations         |
| `sentence`    | `ExampleSentence`        | JSON Array | Example sentences            |

#### Example CSV Entry

```csv
excuse,v.原谅；n.借口，理由,"{""uk"": ""/ɪkˈskjuːz/"", ""us"": ""/ɪkˈskjuːs/""}","[{""cn_sentence"": ""打扰一下..."", ""origin_sentence"": ""Excuse me...""}]"
```

#### Phonetic JSON Format

```json
{
  "uk": "/ɪkˈskjuːz/",
  "us": "/ɪkˈskjuːs/"
}
```

#### Example Sentences JSON Format

```json
[
  {
    "cn_sentence": "中文例句",
    "origin_sentence": "English sentence"
  }
]
```

## 💻 Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start development server (http://localhost:3000)
pnpm build            # Build for production
pnpm preview          # Preview production build locally
pnpm generate         # Generate static site

# Database
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:push      # Sync schema to database (no migration)
pnpm prisma:migrate   # Create and run migration
pnpm prisma:studio    # Open Prisma Studio GUI
pnpm prisma:seed      # Run seed data script

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint issues
```

### Code Conventions

- **TypeScript**: Use strict type checking throughout
- **ESLint**: Follow Nuxt 4 ESLint rules
- **File Naming**: Use kebab-case for components and pages
- **Vue**: Use Composition API with `<script setup>`
- **Prisma**: Follow Prisma naming conventions

### Database Migrations

When making schema changes:

1. Update `prisma/schema.prisma`
2. Create migration: `pnpm prisma:migrate dev --name descriptive-name`
3. Review migration in `prisma/migrations/`
4. Commit migration files with your changes

## 🔧 Configuration

### Nuxt Configuration

Located in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint']
})
```

### Prisma Configuration

- Schema: `prisma/schema.prisma`
- Config: `prisma.config.ts`
- Migrations: `prisma/migrations/`
- Environment Script: `scripts/prisma.ts`
- Database Provider: PostgreSQL

## 🌐 API Documentation

### Current Endpoints

#### GET /api/users

Returns all users with their associated posts (example endpoint).

**Response:**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-16T00:00:00.000Z",
    "updatedAt": "2026-01-16T00:00:00.000Z",
    "posts": [...]
  }
]
```

### Planned Endpoints

#### Word Management

- `GET /api/words` - List words with pagination and filters
- `GET /api/words/:id` - Get word details
- `POST /api/words` - Create new word
- `PUT /api/words/:id` - Update word
- `DELETE /api/words/:id` - Delete word

#### Learning Features

- `GET /api/words/review` - Get words due for review
- `POST /api/words/review/:id` - Submit review result
- `GET /api/stats/overview` - Learning statistics
- `GET /api/stats/progress` - Learning progress

#### Books

- `GET /api/books` - List user's books
- `POST /api/books` - Create new book
- `GET /api/books/:id` - Get book details
- `POST /api/books/:id/words` - Add word to book

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, descriptive commit messages
- Add tests for new features
- Follow the existing code style
- Update documentation as needed

## 📝 License

[Add your license here]

## 🔗 Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify `.env` file exists with correct `NUXT_DATABASE_URL`
2. Ensure PostgreSQL service is running
3. Check database user has sufficient permissions
4. Run `pnpm prisma:generate` to update Prisma Client

### Prisma Client Errors

```bash
# Regenerate Prisma Client
pnpm prisma:generate

# Reset database (WARNING: Deletes all data)
pnpm prisma:push --force-reset
```

### Development Server Issues

If pages don't render or routes don't work:

1. Ensure files are in `app/pages/` directory
2. Verify file naming follows Nuxt conventions (e.g., `index.vue`, `[id].vue`)
3. Restart development server: `pnpm dev`
4. Check for TypeScript errors in terminal

## 📞 Support

For questions, issues, or suggestions:

- Open an issue on GitHub
- Check existing documentation in `AGENTS.md` (Chinese)
- Refer to official documentation links above

---

**Built with ❤️ using Nuxt 4, Vue 3, and Prisma**
