# Playwright UI & API Automation Framework

A TypeScript-based test automation framework built using **Microsoft Playwright Test**, designed for scalable UI and API test automation.

The framework demonstrates a modular automation architecture using Page Object Model (POM), reusable utilities, test data management, browser configuration, parallel execution, failure diagnostics, Allure reporting, and Jenkins CI/CD integration.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Programming language |
| Playwright Test | UI and API test automation |
| Node.js | JavaScript runtime |
| Page Object Model | Maintainable automation architecture |
| Allure | Test execution reporting |
| Jenkins | CI/CD integration |
| Git & GitHub | Source control |
| GitHub Actions | Workflow configuration |

## Framework Architecture

```text
playwright-ui-api-Framework/
│
├── .github/
│   └── workflows/             # GitHub workflow configuration
│
├── pageObjects/               # Page Object Model classes
│
├── testData/                  # Test data and input management
│
├── tests/                     # UI and API test specifications
│
├── types/                     # TypeScript type definitions
│
├── utils/                     # Reusable utilities and helpers
│
├── Jenkinsfile                # Jenkins CI/CD pipeline
│
├── playwright.config.ts       # Primary Playwright configuration
│
├── playwright.config1.ts      # Alternate browser/device configuration
│
├── package.json               # Dependencies and npm scripts
│
├── package-lock.json          # Dependency lock file
│
└── .gitignore                 # Git exclusions
```

## Key Framework Capabilities

### 1. UI Test Automation

- Browser-based end-to-end automation using Playwright.
- Page Object Model for reusable page interactions.
- Centralized locators and page-level actions.
- Test organization using Playwright Test specifications.
- Tag-based execution using `@Web`.
- Parallel execution using Playwright workers.

### 2. API Test Automation

- API test execution using Playwright Test.
- API test organization using the `@API` grep expression.
- Shared Playwright Test runner and configuration architecture.
- Reusable utilities and test data organization.

### 3. Page Object Model (POM)

The framework follows a modular Page Object Model architecture.

Key benefits:

- Separation of test logic and page interactions.
- Reusable page-level methods.
- Centralized locator management.
- Reduced duplication.
- Improved maintainability and scalability.

### 4. Playwright Configuration

The repository includes two Playwright configuration files.

**Primary: `playwright.config.ts`**

- Test directory: `tests/`
- Chromium browser project.
- Fully parallel test execution.
- CI-specific retry configuration.
- CI worker configuration.
- Line and Allure reporters.
- Screenshot capture on failure.
- Trace retention on failure.

**Alternate: `playwright.config1.ts`**

Provides a separate configuration for additional browser and device testing.

### 5. Failure Diagnostics

The primary configuration includes:

| Capability | Configuration |
|---|---|
| Screenshots | `only-on-failure` |
| Trace | `retain-on-failure` |
| Video | Disabled |
| CI retries | 2 |
| CI workers | 1 |
| Local parallel execution | Enabled |

Playwright trace and screenshot artifacts help investigate test failures.

### 6. Allure Reporting

The framework integrates Allure Playwright reporting.

Execute web tests with Allure:

```bash
npm run webtestsAllure
```

Generate the report:

```bash
npm run allure:generate
```

Open the report:

```bash
npm run allure:open
```

### 7. Jenkins CI/CD Integration

The repository includes a declarative Jenkins pipeline.

The current pipeline executes these stages:

1. Checkout source code.
2. Install dependencies using `npm ci`.
3. Install Playwright browsers.
4. Execute web automation tests with Allure reporting.
5. Archive Allure result artifacts.

The pipeline uses Node.js 22 through the configured Jenkins NodeJS installation.

## Prerequisites

- Node.js 22
- npm
- Git
- Visual Studio Code (recommended)
- Jenkins (for CI/CD execution)

## Installation

Clone the repository:

```bash
git clone https://github.com/kanakarajum/playwright-ui-api-Framework.git
```

Navigate to the project:

```bash
cd playwright-ui-api-Framework
```

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

## Test Execution

### Run all tests

```bash
npm run regression
```

### Run UI tests

```bash
npm run webtests
```

### Run API tests

```bash
npm run APITests
```

### Run UI tests with Allure

```bash
npm run webtestsAllure
```

### Generate and view Allure reports

```bash
npm run allure:generate
npm run allure:open
```

### Run using an alternate configuration

```bash
npx playwright test --config playwright.config1.ts
```

## Configuration and Extensibility

The framework can be extended through Playwright configuration and reusable automation components.

Important configuration options include:

- `testDir` – Test specification location.
- `fullyParallel` – Parallel execution strategy.
- `workers` – Number of parallel workers.
- `retries` – Failed test retry strategy.
- `reporter` – Test reporting configuration.
- `projects` – Browser and device configurations.
- `trace` – Execution trace collection.
- `screenshot` – Failure screenshot collection.

## Engineering Principles

- Modular automation architecture.
- Reusable Page Object Model.
- Separation of test data and test logic.
- UI and API automation.
- Parallel execution and retry mechanisms.
- Cross-browser and device-oriented configuration.
- Failure diagnostics and reporting.
- CI/CD integration.

## Future Enhancements

- Expanded API automation examples.
- Environment-based test configuration.
- Enhanced API authentication and test-data utilities.
- Video recording for failed tests.
- Automated report publishing.
- Extended cross-browser execution.
- API and UI execution within unified CI/CD pipelines.

## Author

**Kanakaraju M**

Playwright | TypeScript | UI & API Automation | Quality Engineering | Automation Architecture | CI/CD

---

If you find this project useful, consider giving the repository a ⭐.

**Repository:** https://github.com/kanakarajum/playwright-ui-api-Framework
