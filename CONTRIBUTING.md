# Contributing

Thank you for your interest in contributing to svelte-currency-input! This document provides guidelines and instructions for contributing.

## Ways to contribute

- Report bugs by opening a [new issue](https://github.com/fmaclen/svelte-currency-input/issues/new)
- Comment or upvote [existing issues](https://github.com/fmaclen/svelte-currency-input/issues)
- Submit a [pull request](https://github.com/fmaclen/svelte-currency-input/pulls)
- Improve documentation

## Development setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Bun](https://bun.sh/) (recommended) or npm/pnpm/yarn

### Getting started

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/svelte-currency-input.git
cd svelte-currency-input
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

The demo site will be available at `http://localhost:5173`.

### Project structure

```
src/
├── lib/                       # Library source code (published to npm)
│   ├── currency-input.svelte  # Main component
│   ├── index.ts               # Public exports
│   ├── types.ts               # TypeScript types
│   └── utils/                 # Utility functions
├── routes/                    # Demo site (SvelteKit routes)
│   ├── +page.svelte           # Demo homepage
│   ├── test/                  # E2E test fixtures
│   └── *.svelte               # Demo components
tests/
├── unit/                      # Unit tests (Vitest)
└── e2e/                       # End-to-end tests (Playwright)
```

## Testing strategy

The project uses a multi-layered testing approach:

### 1. Unit tests (Vitest)

Pure utility functions are tested in isolation. Each utility has a corresponding `.spec.ts` file:

```
src/lib/utils/          tests/unit/
├── cleanValue.ts       ├── cleanValue.spec.ts
├── formatValue.ts      ├── formatValue.spec.ts
└── ...                 └── ...
```

**Run unit tests:**

```bash
# Watch mode
bun run test:unit

# Single run
bun run test:unit -- --run
```

### 2. End-to-end tests (Playwright)

Browser-based tests for real user interactions, covering:

- Basic input/output behavior
- Locale formatting
- Decimal handling
- Min/max constraints
- Arrow key stepping
- Abbreviations (k, m, b)
- Negative values
- Cursor positioning

E2E tests use the test fixture page at `/test` which provides a configurable input for testing various scenarios.

**Run E2E tests:**

```bash
# Run all E2E tests
bun run test:e2e

# Run specific test file
npx playwright test tests/e2e/basic.test.ts

# Run in headed mode (see the browser)
npx playwright test --headed

# Run in UI mode (interactive)
npx playwright test --ui

# Debug a specific test
npx playwright test tests/e2e/basic.test.ts --debug
```

### 3. Running all tests

```bash
bun run test
```

This runs both unit tests and E2E tests.

## Available scripts

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `bun run dev`       | Start development server            |
| `bun run build`     | Build the library and demo site     |
| `bun run preview`   | Preview the production build        |
| `bun run check`     | Run Svelte type checking            |
| `bun run lint`      | Run Prettier and ESLint checks      |
| `bun run format`    | Format code with Prettier           |
| `bun run quality`   | Run format, lint, and type checking |
| `bun run test:unit` | Run unit tests (watch mode)         |
| `bun run test:e2e`  | Run E2E tests                       |
| `bun run test`      | Run all tests                       |

## Code quality

Before submitting a PR, ensure your code passes all quality checks:

```bash
bun run quality
bun run test
```

### Formatting

The project uses Prettier for code formatting. Format your code before committing:

```bash
bun run format
```

### Linting

ESLint is configured with Svelte and TypeScript support:

```bash
bun run lint
```

### Type checking

Svelte-check validates TypeScript and Svelte component types:

```bash
bun run check
```

## Pull request guidelines

1. **Create a feature branch** from the `next` branch (or `main` if targeting a patch release):

```bash
git checkout -b feature/my-feature
```

2. **Make your changes** with clear, focused commits

3. **Add tests** for new functionality or bug fixes

4. **Update documentation** if your changes affect the public API

5. **Run quality checks** before pushing:

```bash
bun run quality
bun run test
```

6. **Submit a pull request** with a clear description of your changes

## Adding new features

When adding new features:

1. **Update types** in `src/lib/types.ts` if needed

2. **Update the component** in `src/lib/currency-input.svelte`

3. **Export new utilities** from `src/lib/utils/index.ts` and `src/lib/index.ts` if applicable

4. **Add unit tests** for new utility functions

5. **Add E2E tests** for user-facing behavior changes

6. **Update the demo** to showcase the feature (add/update components in `src/routes/`)

7. **Update documentation** in `README.md`

## Release process

Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release) and GitHub Actions:

- Pushes to `main` trigger stable releases (`1.0.0`, `1.0.1`, etc.)
- Pushes to `next` trigger pre-releases (`1.0.0-next.1`, `1.0.0-next.2`, etc.)

Commit messages should follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation only
- `chore:` - Maintenance tasks
- `BREAKING CHANGE:` - Breaking change (major version bump)

## Need help?

- Open a [discussion](https://github.com/fmaclen/svelte-currency-input/discussions) for questions
- Check existing [issues](https://github.com/fmaclen/svelte-currency-input/issues) for similar problems
- Review the [README](./README.md) for API documentation
