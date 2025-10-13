 criteria for validation
- Test data and scenarios
- Monday.com item reference

QA Workflow Will:
1. Generate E2E test cases
2. Run automated tests (Playwright/Cypress)
3. Perform manual validation checklist
4. Report bugs if found
5. Approve for production if passed

Handoff complete: SE → QA
```

---

## Tech Stack Configuration

### Frontend Frameworks Supported
- React + TypeScript (default)
- Vue 3 + TypeScript
- Angular
- Next.js
- Svelte

### Testing Frameworks
- Jest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E)
- Cypress (E2E alternative)

### Git Platforms
- GitHub
- GitLab
- Bitbucket

### CI/CD Tools
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

---

## Code Generation Examples

### Input (from UX):
```html
<div class="login-form">
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button>Login</button>
</div>
```

### Output (React Component):
```typescript
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        aria-label="Email address"
        className="..."
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        aria-label="Password"
        className="..."
      />
      {error && <div role="alert" className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Generated Tests:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('calls login on submit with valid data', async () => {
    mockLogin.mockResolvedValue(true);
    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });
});
```

---

## Environment Variables

```env
# Repository
GIT_PROVIDER=github  # or gitlab, bitbucket
GIT_TOKEN=ghp_xxxxx
GIT_REPO_URL=https://github.com/user/repo.git
GIT_DEFAULT_BRANCH=main

# CI/CD
CI_PROVIDER=github_actions
CI_TRIGGER_TOKEN=xxxxx

# Test Environment
TEST_ENV_URL=https://test.yourapp.com
TEST_ENV_DEPLOY_KEY=xxxxx

# Code Quality
ESLINT_CONFIG=.eslintrc.js
PRETTIER_CONFIG=.prettierrc

# Testing
TEST_COVERAGE_THRESHOLD=80
```

---

## Success Criteria

Before triggering QA workflow, verify:
- ✅ All unit tests pass
- ✅ Code coverage > 80%
- ✅ ESLint passes with no errors
- ✅ TypeScript compiles without errors
- ✅ Build succeeds
- ✅ Deployed to test environment
- ✅ Smoke tests pass

---

## Error Handling

### Build Failure
- Rollback deployment
- Create GitHub issue
- Update Monday.com status to "Build Failed"
- Notify dev team

### Test Failure
- Block deployment
- Generate test report
- Comment on PR with failures
- Assign back to SE for fixes

### Deployment Failure
- Attempt automatic rollback
- Alert DevOps team
- Log error details
- Update Monday.com

---

## Monitoring

Track these metrics:
- Average time: UX approval → Code ready
- Test coverage percentage
- Build success rate
- Deployment frequency
- Bug escape rate (found in QA)

Target: < 4 hours from UX → QA

---

**Document Complete!**  
Ready to build Software Engineer workflow in n8n.
