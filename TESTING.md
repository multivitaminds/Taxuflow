# Testing Guide

## Overview

This project includes comprehensive testing coverage across unit tests, integration tests, and end-to-end tests.

## Test Structure

```
__tests__/
├── unit/                  # Unit tests for individual components
│   ├── components/        # Component tests
│   └── utils/            # Utility function tests
├── integration/          # Integration tests for workflows
│   ├── accounting/       # Accounting platform flows
│   └── neobank/         # Neobank platform flows
├── e2e/                 # End-to-end tests with Playwright
│   ├── accounting/      # Accounting E2E tests
│   └── neobank/        # Neobank E2E tests
└── performance/        # Performance benchmarks
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in CI mode
npm run test:ci

# Generate coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Performance Tests
```bash
# Run Lighthouse performance tests
npm run test:performance
```

## Writing Tests

### Unit Test Example
```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('navigates to dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.locator('h1')).toContainText('Dashboard')
})
```

## Performance Guidelines

### Optimization Checklist
- ✅ Lazy load images and heavy components
- ✅ Use React.memo for expensive components
- ✅ Implement debouncing for search inputs
- ✅ Code split routes with dynamic imports
- ✅ Optimize bundle size with tree shaking
- ✅ Use server components where possible
- ✅ Cache API responses with SWR or React Query

### Performance Targets
- Performance Score: > 90
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
```

## Coverage Requirements

Maintain minimum coverage:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Best Practices

1. **Test Behavior, Not Implementation** - Focus on what users see and do
2. **Keep Tests Simple** - One assertion per test when possible
3. **Use Descriptive Names** - Test names should describe the scenario
4. **Mock External Dependencies** - Isolate the code under test
5. **Clean Up** - Reset state between tests
6. **Run Tests Locally** - Before pushing to CI

## Debugging Tests

```bash
# Run specific test file
npm test -- MyComponent.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run with verbose output
npm test -- --verbose

# Debug with Chrome DevTools
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Resources

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)
- [Jest Docs](https://jestjs.io/)
