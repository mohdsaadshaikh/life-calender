# Contributing to Life Calendar

Thank you for your interest in contributing to Life Calendar! We welcome contributions from everyone, whether it's code, documentation, design, or ideas.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@life-calendar.app.

## How to Contribute

### 1. Report Bugs

**Before creating a bug report, check the issue list** as you might find out that you don't need to create one.

When creating a bug report, include as many details as possible:
- **Title**: Clear, descriptive title
- **Description**: What you expected to happen, what actually happened
- **Steps to Reproduce**: Step-by-step instructions to reproduce the behavior
- **Screenshots**: If applicable, screenshots of the bug
- **Environment**: Your browser, OS, device type
- **Additional Context**: Any other context that might help

**Example**:
```
Title: Export button doesn't work on mobile

Description: 
When clicking the export button on an iOS device, nothing happens.

Steps to Reproduce:
1. Open app on iPhone
2. Navigate to settings
3. Click "Export Backup" button
4. Nothing happens (no file download, no error message)

Expected: 
Should download a JSON file named "life-calendar-backup-YYYY-MM-DD.json"

Environment:
- Device: iPhone 12 Pro
- Browser: Safari 15.1
- App Version: 1.0.0
```

### 2. Suggest Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:
- **Title**: Brief description of the enhancement
- **Current Behavior**: How the feature currently works
- **Suggested Behavior**: How you'd like it to work
- **Use Case**: Why this would be useful
- **Examples**: Examples from other apps (if applicable)

**Example**:
```
Title: Add dark mode toggle to settings

Current Behavior:
The app has a light theme only.

Suggested Behavior:
Add a toggle in the settings panel to switch between light and dark themes.

Use Case:
Users working in low-light environments would benefit from a dark theme.
Also reduces eye strain for evening users.

Examples:
- GitHub, Twitter, and other modern web apps have this feature
- Could use prefers-color-scheme CSS media query
```

### 3. Contribute Code

#### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Go to https://github.com/your-username/life-calendar/fork
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/life-calendar.git
   cd life-calendar
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-author/life-calendar.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or for bug fixes:
   git checkout -b fix/issue-description
   ```

#### Development Workflow

1. **Make your changes**
   - Code should follow the project's style guide
   - Keep commits small and focused
   - Write descriptive commit messages

2. **Test your changes**
   ```bash
   # Run development server
   pnpm dev
   
   # Run linting
   pnpm lint
   pnpm lint --fix
   
   # Run tests (when available)
   pnpm test
   ```

3. **Check TypeScript**
   ```bash
   # Make sure there are no TypeScript errors
   pnpm build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "Brief description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe your changes and why they're needed
   - Include before/after screenshots if applicable

#### Pull Request Checklist

- [ ] Code follows the project style guidelines
- [ ] You've tested your changes locally
- [ ] No TypeScript errors (`pnpm build` passes)
- [ ] ESLint passes (`pnpm lint`)
- [ ] You've added comments for complex logic
- [ ] You've updated documentation if needed
- [ ] You've added tests for new functionality (when applicable)
- [ ] You've updated the CHANGELOG

## Code Style Guide

### TypeScript & JavaScript

- **Indent**: 2 spaces (not tabs)
- **Semicolons**: Required
- **Quotes**: Double quotes for strings
- **Line Length**: 100 characters (soft limit), 120 (hard limit)
- **Variable Names**: camelCase for variables and functions, PascalCase for components
- **Constants**: UPPER_SNAKE_CASE for truly constant values

```typescript
// Good
const MAX_TITLE_LENGTH = 100
const useEventForm = () => { /* ... */ }
function calculateWeeks(birthDate: Date): number { /* ... */ }
export function MyComponent(): JSX.Element { /* ... */ }

// Avoid
const maxTitleLength = 100
const use_event_form = () => {}
function calculateweeks() {}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Include JSDoc comments for complex components
- Use proper HTML semantics

```typescript
// Good
export interface MyComponentProps {
  title: string
  onClick: () => void
  disabled?: boolean
}

/**
 * Displays a clickable button with optional disabled state
 * @param title - Button label text
 * @param onClick - Callback when button is clicked
 * @param disabled - Whether button is disabled
 */
export function MyButton({ title, onClick, disabled }: MyComponentProps): JSX.Element {
  return (
    <button onClick={onClick} disabled={disabled} type="button">
      {title}
    </button>
  )
}
```

### CSS & Styling

- Use Tailwind CSS utility classes
- For complex styles, use `className` helper from `@/lib/utils`
- Keep inline styles minimal
- Use CSS variables for theme colors

```tsx
// Good
<div className="flex items-center gap-2 p-4 bg-primary neo-border">
  <span className="font-bold text-lg">Hello</span>
</div>

// Avoid
<div style={{ display: 'flex', gap: '8px', padding: '16px' }}>
```

### File Organization

```
components/life-calendar/
├── my-feature.tsx        # Component implementation
├── my-feature.types.ts   # Type definitions
└── __tests__/
    └── my-feature.test.tsx
```

### Commit Messages

Format: `type(scope): subject`

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(event-modal): add recurring event support
fix(calendar-grid): fix week color calculation
docs: update README with new features
refactor(settings): simplify form validation
perf(grid): optimize week data memoization
```

## Testing

### Writing Tests

Tests should be clear, focused, and maintainable:

```typescript
// components/__tests__/my-component.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../my-component'

describe('MyComponent', () => {
  it('should render with title', () => {
    render(<MyComponent title="Test" onClick={jest.fn()} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const onClick = jest.fn()
    render(<MyComponent title="Test" onClick={onClick} />)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(onClick).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<MyComponent title="Test" onClick={jest.fn()} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## Documentation

### JSDoc Comments

Add JSDoc comments to exported functions and components:

```typescript
/**
 * Calculates the number of weeks lived since birth date
 * @param birthDate - The person's birth date
 * @param targetDate - Date to calculate weeks until (defaults to today)
 * @returns Number of complete weeks lived
 * @throws {Error} If birthDate is invalid
 * 
 * @example
 * const weeksLived = calculateWeeksLived(new Date('2000-01-01'))
 * console.log(weeksLived) // ~1300
 */
export function calculateWeeksLived(birthDate: Date, targetDate: Date = new Date()): number {
  // Implementation
}
```

### README Updates

If your contribution changes user-facing functionality, update the relevant section in README.md

### CHANGELOG Updates

Add an entry to track changes:

```markdown
## [Unreleased]

### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Breaking change description
```

## Review Process

1. **Automated Checks**
   - TypeScript compilation
   - ESLint checks
   - Tests (when available)

2. **Code Review**
   - We'll review your PR and provide feedback
   - Be responsive to comments
   - Make requested changes promptly

3. **Merge**
   - Once approved, your PR will be merged
   - Your contribution is now part of Life Calendar!

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉

---

## Additional Resources

- [Project Architecture](./CLAUDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Code Review Plan](./CODE_REVIEW_AND_FIX_PLAN.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Questions?

- **Discussions**: [GitHub Discussions](https://github.com/your-username/life-calendar/discussions)
- **Email**: support@life-calendar.app
- **Issues**: [GitHub Issues](https://github.com/your-username/life-calendar/issues)

Happy contributing! 🚀
