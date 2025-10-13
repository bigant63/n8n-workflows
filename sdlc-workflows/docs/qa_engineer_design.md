# QA Engineer Workflow - Design Document

## Overview
Automated quality assurance workflow that generates test cases, runs E2E tests, performs validation, and reports results.

## Workflow Architecture

```
[Webhook: SE Deployed] → [Generate Test Cases] → [Setup Test Environment]
                                    │
                                    ├──> [Run E2E Tests (Playwright)]
                                    │
                                    ├──> [Visual Regression Tests]
                                    │
                                    ├──> [Accessibility Tests]
                                    │
                                    ├──> [Performance Tests]
                                    │
                                    ├──> [Security Scan]
                                    │
                                    ├──> [Aggregate Results]
                                    │
                                    ├──> [Create Bug Reports]
                                    │
                                    └──> [Update Monday.com] → [Decision: Pass/Fail]
                                                                        │
                                                    Pass ───────────────┴───> [Notify Production Deploy]
                                                    Fail ───────────────────> [Notify SE for Fixes]
```

## Key Nodes

### 1. Webhook: SE Deployment Complete
**Path**: `/webhook/qa-start-testing`  
**Receives**: Deployment notification from SE workflow

**Payload**:
```json
{
  "story_id": "STORY-123",
  "test_url": "https://test.yourapp.com/feature-123",
  "pr_url": "https://github.com/repo/pull/456",
  "acceptance_criteria": [
    "User can login with email",
    "Password validation works",
    "Error messages display correctly"
  ],
  "test_data": {
    "test_users": [...],
    "test_scenarios": [...]
  },
  "monday_item_id": "67890"
}
```

**Node Notes**:
```
🚀 DEPLOYMENT NOTIFICATION

Receives notification when SE deploys to test environment.
Triggers comprehensive QA testing suite.

Input: Test URL + acceptance criteria
Output: Automated test execution

Endpoint: POST /webhook/qa-start-testing
Triggered by: Software Engineer workflow
```

---

### 2. AI Test Case Generator
**Type**: OpenAI/Claude Agent

**System Prompt**:
```
You are an expert QA Engineer AI that creates comprehensive test cases.

Your responsibilities:
1. Analyze acceptance criteria and generate test scenarios
2. Create positive and negative test cases
3. Consider edge cases and boundary conditions
4. Generate test data sets
5. Create Playwright/Cypress E2E tests
6. Include accessibility validation
7. Add visual regression checkpoints

Test Types to Generate:
- Happy path scenarios
- Error handling scenarios
- Edge cases (empty inputs, special characters, etc.)
- Cross-browser compatibility checks
- Mobile responsiveness tests
- Accessibility (WCAG 2.1 AA)
- Performance thresholds

Output Format:
- Playwright test files (.spec.ts)
- Test data JSON files
- Expected results documentation
```

**Node Notes**:
```
🧪 TEST CASE GENERATOR

Generates comprehensive test suite from requirements.

Input: Acceptance criteria + feature description
Output: 
- Playwright E2E tests
- Test data sets
- Expected outcomes

Generates ~10-20 test cases per feature including:
- Happy paths (3-5)
- Error scenarios (3-5)
- Edge cases (2-3)
- Accessibility checks (2-3)
- Performance tests (1-2)

Model: GPT-4 or Claude Sonnet
Temperature: 0.1 (precise, deterministic tests)
```

---

### 3. Setup Test Environment
**Type**: Code Node

**Purpose**: Prepare test environment with data and configuration

**Code**:
```javascript
const testUrl = $json.test_url;
const testData = $json.test_data;

// Seed test database
await fetch(`${testUrl}/api/test/seed`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
});

// Clear cache and cookies
await fetch(`${testUrl}/api/test/clear-cache`, { method: 'POST' });

// Set test environment flags
await fetch(`${testUrl}/api/test/configure`, {
  method: 'POST',
  body: JSON.stringify({
    mode: 'test',
    mockExternalAPIs: true,
    captureScreenshots: true
  })
});

return [{
  json: {
    testUrl: testUrl,
    ready: true,
    timestamp: new Date().toISOString()
  }
}];
```

**Node Notes**:
```
🔧 TEST ENVIRONMENT SETUP

Prepares test environment for automated testing.

Actions:
1. Seed database with test data
2. Clear caches and cookies
3. Configure test mode
4. Enable screenshot capture
5. Mock external API calls

Ensures: Clean, reproducible test state

Output: Ready-to-test environment URL
```

---

### 4. Run E2E Tests (Playwright)
**Type**: Execute Command Node

**Command**:
```bash
cd /path/to/tests && \
npx playwright test \
  --config=playwright.config.ts \
  --reporter=html,json \
  --output=/tmp/test-results \
  --screenshot=on \
  --video=on \
  --trace=on
```

**Generated Test Example** (from AI):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow - STORY-123', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://test.yourapp.com/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill login form
    await page.fill('[aria-label="Email address"]', 'test@example.com');
    await page.fill('[aria-label="Password"]', 'Password123!');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify user name displayed
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
  });

  test('should show error with invalid email format', async ({ page }) => {
    await page.fill('[aria-label="Email address"]', 'invalid-email');
    await page.fill('[aria-label="Password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Error should be visible
    await expect(page.locator('[role="alert"]')).toContainText('Invalid email format');
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle network error gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/auth/login', route => route.abort());
    
    await page.fill('[aria-label="Email address"]', 'test@example.com');
    await page.fill('[aria-label="Password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Should show network error
    await expect(page.locator('[role="alert"]')).toContainText('Network error');
  });

  test('should be accessible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

**Node Notes**:
```
🎭 PLAYWRIGHT E2E TESTS

Runs automated end-to-end tests against test environment.

Test Coverage:
- User flows and interactions
- Form submissions
- Navigation
- Error handling
- API integrations
- Cross-browser (Chromium, Firefox, WebKit)

Captures:
- Screenshots on failure
- Video recordings
- Trace files for debugging
- Console logs

Output: Test results JSON + HTML report

Success Rate Target: >95%
```

---

### 5. Visual Regression Tests
**Type**: Execute Command or API Call

**Purpose**: Compare screenshots against baseline

**Command**:
```bash
npx percy exec -- playwright test --grep @visual
```

**Node Notes**:
```
👁️ VISUAL REGRESSION TESTING

Compares UI screenshots against approved baseline.

Uses: Percy.io or Chromatic

Checks for:
- Unintended visual changes
- Layout shifts
- Color/styling changes
- Responsive breakpoints

Threshold: <0.1% pixel difference

Flags: Changes for manual review
```

---

### 6. Accessibility Tests
**Type**: Execute Command

**Command**:
```bash
npx playwright test --grep @accessibility
# Uses axe-core via playwright-axe
```

**Node Notes**:
```
♿ ACCESSIBILITY VALIDATION

Runs automated accessibility checks (WCAG 2.1 AA).

Tests:
- Color contrast ratios
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Alt text on images

Standards: WCAG 2.1 Level AA

Tool: axe-core + playwright-axe

Blocks: Any critical violations
Warns: Minor violations for review
```

---

### 7. Performance Tests
**Type**: Code Node (Lighthouse API)

**Code**:
```javascript
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});

const options = {
  logLevel: 'info',
  output: 'json',
  onlyCategories: ['performance', 'accessibility', 'best-practices'],
  port: chrome.port
};

const runnerResult = await lighthouse($json.test_url, options);

await chrome.kill();

const scores = {
  performance: runnerResult.lhr.categories.performance.score * 100,
  accessibility: runnerResult.lhr.categories.accessibility.score * 100,
  bestPractices: runnerResult.lhr.categories['best-practices'].score * 100
};

return [{
  json: {
    scores: scores,
    passed: scores.performance >= 75 && 
            scores.accessibility >= 90 && 
            scores.bestPractices >= 80,
    details: runnerResult.lhr
  }
}];
```

**Node Notes**:
```
⚡ PERFORMANCE TESTING

Runs Lighthouse performance audit.

Metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)

Thresholds:
- Performance: ≥75
- Accessibility: ≥90
- Best Practices: ≥80

Fails if: Any score below threshold

Output: Detailed Lighthouse report
```

---

### 8. Security Scan
**Type**: HTTP Request (OWASP ZAP or Snyk)

**Purpose**: Basic security vulnerability scan

**Node Notes**:
```
🔒 SECURITY SCANNING

Runs automated security checks.

Scans for:
- XSS vulnerabilities
- SQL injection risks
- Insecure dependencies
- Exposed sensitive data
- HTTPS enforcement
- CORS misconfigurations

Tools: OWASP ZAP (active scan)

Severity Levels:
- Critical: Block deployment
- High: Require fix before prod
- Medium: Create ticket
- Low: Document for review

Output: Security report with remediation steps
```

---

### 9. Aggregate Test Results
**Type**: Code Node

**Purpose**: Combine all test results into single report

**Code**:
```javascript
const e2eResults = $node["Run E2E Tests"].json;
const visualResults = $node["Visual Regression Tests"].json;
const a11yResults = $node["Accessibility Tests"].json;
const perfResults = $node["Performance Tests"].json;
const securityResults = $node["Security Scan"].json;

const totalTests = e2eResults.total;
const passedTests = e2eResults.passed;
const failedTests = e2eResults.failed;

const allPassed = 
  e2eResults.success &&
  visualResults.passed &&
  a11yResults.violations === 0 &&
  perfResults.passed &&
  securityResults.severity !== 'critical';

const report = {
  storyId: $json.story_id,
  timestamp: new Date().toISOString(),
  overallStatus: allPassed ? 'PASSED' : 'FAILED',
  summary: {
    e2e: { total: totalTests, passed: passedTests, failed: failedTests },
    visual: visual