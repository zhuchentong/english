# Testing Setup

This project follows **Test-Driven Development (TDD)** workflow with comprehensive testing infrastructure for both unit and end-to-end tests.

## 🧪 Test Stack

| Type                   | Framework                     | Purpose                      |
| ---------------------- | ----------------------------- | ---------------------------- |
| **Unit Tests**         | Vitest + @vue/test-utils      | Fast, isolated tests         |
| **Nuxt Runtime Tests** | @nuxt/test-utils + happy-dom  | Component + composable tests |
| **E2E Tests**          | Playwright + @nuxt/test-utils | Full browser testing         |

## 📁 Test Directory Structure

```
./
├── test/
│   ├── unit/              # Pure unit tests (Node environment)
│   ├── nuxt/              # Nuxt runtime tests (mountSuspended, etc.)
│   └── e2e/               # End-to-end tests (Playwright)
├── app/__tests__/        # App-level tests (components, pages, composables)
│   ├── components/
│   ├── pages/
│   └── composables/
└── server/__tests__/      # Server-side tests
    ├── api/               # API route tests
    └── utils/             # Utility function tests
```

## 🚀 Available Commands

### Unit & Integration Tests (Vitest)

```bash
# Run all unit tests once
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run tests with UI interface
pnpm test:ui

# Run specific test file
pnpm test server/__tests__/utils/db.test.ts

# Run specific project
pnpm test --project unit
pnpm test --project nuxt
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Debug E2E tests
pnpm test:e2e:debug

# Run E2E tests in specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

## 🎯 TDD Workflow

Follow the **RED → GREEN → REFACTOR** cycle:

```bash
# 1. RED - Write a failing test
# Create test file with assertion that fails

# 2. Run tests (should fail)
pnpm test

# 3. GREEN - Write minimum code to pass
# Implement just enough to make tests pass

# 4. Run tests again (should pass)
pnpm test

# 5. REFACTOR - Clean up while keeping green
# Refactor code, tests must still pass

# 6. Run tests again
pnpm test

# 7. Commit
git add .
git commit -m "feat: [feature description]"
```

## 📝 Test File Naming

- **Unit tests**: `*.test.ts` or `*.spec.ts`
- **E2E tests**: `*.e2e.ts` or in `test/e2e/` directory
- **Test descriptions**: Use `it('should do something')` pattern

### Example Test Structure

```typescript
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup before each test
  })

  afterEach(async () => {
    // Cleanup after each test
  })

  it('should do something specific', async () => {
    // Arrange
    const input = 'test'

    // Act
    const result = doSomething(input)

    // Assert
    expect(result).toBe('expected')
  })

  it('should handle edge case', async () => {
    // Test edge case
  })

  it.todo('should implement future feature')
})
```

## 🔧 Configuration

### Vitest Config (`vitest.config.ts`)

- **Projects**: 3 separate test environments
  - `unit`: Node environment for fast unit tests
  - `server`: Node environment for API tests
  - `nuxt`: Full Nuxt runtime environment for component tests
- **Coverage**: v8 provider with HTML/JSON/text reports
- **Path Aliases**: Configured to match Nuxt aliases (`@/`, `@@/`, `@/prisma`, `@/server`)

### Playwright Config (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Auto-starts Nuxt dev server
- **Reporters**: HTML, JUnit, list
- **Screenshots/Videos**: Only on failure

## 📊 Coverage

Run coverage with:

```bash
pnpm test:coverage
```

Coverage reports are generated in:

- `coverage/` directory
- HTML report: Open `coverage/index.html`

**Coverage Targets** (recommended):

- Statements: ≥ 80%
- Branches: ≥ 80%
- Functions: ≥ 80%
- Lines: ≥ 80%

## ⚠️ Known Issues & TODOs

### Current Limitations

1. **Prisma Client Path Alias**: Tests importing from `@/prisma` may fail in vitest due to path resolution issues
   - **Workaround**: Use relative imports or skip database connection tests
   - **TODO**: Fix path alias resolution in `vitest.config.ts`

2. **@nuxt/test-utils Compatibility**: Current version (3.23.0) expects vitest ^3.2.0 but we have 4.0.17
   - **Workaround**: Use placeholder tests in `test/nuxt/` directory
   - **TODO**: Wait for @nuxt/test-utils vitest 4.x support or downgrade to vitest 3.x

### TODOs

- [ ] Fix Prisma Client path alias resolution for unit tests
- [ ] Add database integration tests with test database setup
- [ ] Add actual Nuxt runtime tests once @nuxt/test-utils supports vitest 4.x
- [ ] Configure CI/CD for automated testing
- [ ] Add mutation testing with Stryker or similar

## 📚 Resources

- [Nuxt 4 Testing Documentation](https://nuxt.com/docs/4.x/getting-started/testing)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [@nuxt/test-utils Documentation](https://test-utils.nuxt.com/)

## 🎓 Testing Best Practices

1. **Test Behavior, Not Implementation**: Test what the code does, not how it does it
2. **AAA Pattern**: Arrange, Act, Assert structure
3. **One Assertion Per Test**: Keep tests focused and readable
4. **Descriptive Names**: Test names should read like documentation
5. **Independent Tests**: Tests should not depend on each other
6. **Test Isolation**: Use mocks/stubs to avoid side effects
7. **Edge Cases**: Test null, undefined, empty, boundary values
8. **Error Handling**: Every error scenario should have a test
9. **Fast Tests**: Unit tests should run in < 100ms each
10. **Test First**: Write tests before implementation (TDD)

## 🐛 Troubleshooting

### Prisma Client Not Found

**Error**: `Cannot find module '.prisma/client/default'`

**Solution**:

```bash
pnpm prisma:generate
```

### Path Alias Issues

**Error**: Cannot find module using `@/` alias

**Solution**: Ensure path aliases are configured in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '@/server': fileURLToPath(new URL('./server', import.meta.url)),
  },
}
```

### E2E Tests Not Running

**Error**: Vitest tries to run E2E tests

**Solution**: Ensure `test/e2e/**` is excluded in `vitest.config.ts`:

```typescript
exclude: ['node_modules', '.nuxt', 'dist', 'test/e2e/**', '**/*.e2e.{ts,js}']
```

---

**Generated**: 2026-01-17
**Framework**: Nuxt 4.2.2 + Vitest 4.0.17 + Playwright 1.57.0
