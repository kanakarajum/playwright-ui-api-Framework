# Enterprise Playwright UI & API Automation Framework

A scalable, modular test automation framework built using **Playwright, TypeScript, and Node.js**, supporting UI automation, API testing, reusable test architecture, CI/CD integration, and cloud-based execution through **Azure Playwright Service**.

The framework demonstrates enterprise automation practices, including Page Object Model (POM), reusable utilities, test configuration management, parallel execution, reporting, and cloud-based browser execution.

## Architecture & Technology Stack

| Component | Technology |
|---|---|
| Automation Framework | Playwright |
| Programming Language | TypeScript |
| UI Automation | Playwright |
| API Automation | Playwright APIRequestContext |
| Design Pattern | Page Object Model (POM) |
| Test Organization | Tag-based execution |
| Test Reporting | Allure Reports |
| CI/CD | Jenkins |
| Cloud Execution | Azure Playwright Service |
| Authentication | Azure Identity / DefaultAzureCredential |
| Browser Automation | Chromium, Microsoft Edge |
| Package Management | npm |

## Key Features

### 1. UI Automation
- End-to-end browser automation using Playwright.
- Page Object Model for maintainable and reusable test components.
- Centralized locators and page-level actions.
- Browser and device configuration.
- Screenshots and execution traces for failure analysis.

### 2. API Automation
- API testing using Playwright's request capabilities.
- Support for independent API test execution.
- Reusable API utilities and test-data management.
- Tag-based separation of UI and API test suites.

### 3. Framework Architecture
- Modular framework structure.
- Reusable utilities, helpers, and shared components.
- Centralized test configuration.
- Test data and TypeScript type management.
- Parallel execution and configurable retry mechanisms.

### 4. Azure Cloud Integration
Integrated with **Azure Playwright Service** to enable cloud-based browser test execution.

Key capabilities:
- Integration with Azure Playwright using `@azure/playwright`.
- Azure authentication using `@azure/identity` and `DefaultAzureCredential`.
- Azure Playwright workspace connectivity.
- Configurable connection timeout and network exposure.
- Execution against managed cloud browser infrastructure.

The framework supports local execution as well as Azure-based execution through separate Playwright configurations.

### 5. CI/CD Integration
- Jenkins pipeline integration.
- Automated dependency installation.
- Playwright browser installation.
- Automated UI test execution.
- Allure result artifact collection.

### 6. Test Reporting
- Allure Playwright integration.
- Execution results and failure reporting.
- Screenshots and traces for troubleshooting.
- HTML reporting support.

## Project Structure

```text
playwright-ui-api-Framework/
│
├── .github/
│   └── workflows/
│
├── pageObjects/
│   └── Page-level automation components
│
├── testData/
│   └── Test data and configurations
│
├── tests/
│   └── UI and API test scenarios
│
├── types/
│   └── TypeScript type definitions
│
├── utils/
│   └── Reusable framework utilities
│
├── playwright.config.ts
├── playwright.config1.ts
├── playwright.service.config.ts
├── Jenkinsfile
├── package.json
└── README.md
```

*Note: `playwright.service.config.ts` represents the Azure configuration file; adjust the filename if your actual file uses a different name.*

## Prerequisites

- Node.js 22+
- npm
- Git
- Azure subscription
- Azure Playwright workspace
- Azure CLI (for local Azure CLI authentication)

## Installation

Clone the repository:

```bash
git clone https://github.com/kanakarajum/playwright-ui-api-Framework.git

cd playwright-ui-api-Framework
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Execution Commands

### Local execution

Run all tests:

```bash
npm run regression
```

Run UI tests:

```bash
npm run webtests
```

Run API tests:

```bash
npm run APITests
```

### Azure Playwright Service execution

Authenticate with Azure:

```bash
az login
```

Verify the active subscription:

```bash
az account show
```

Execute tests using the Azure Playwright configuration:

```bash
npx playwright test --config=playwright.service.config.ts
```

*Ensure the Azure workspace configuration, authentication permissions, and required environment settings are configured before execution.*

## Reporting

Generate Allure report:

```bash
npm run allure:generate
```

Open Allure report:

```bash
npm run allure:open
```

Playwright HTML reporting can also be enabled through the corresponding Playwright configuration.

## CI/CD Pipeline

The framework includes a Jenkins pipeline with the following stages:

1. Source code checkout.
2. Dependency installation.
3. Playwright browser installation.
4. UI test execution.
5. Allure execution result archival.

## Engineering Practices Demonstrated

- Enterprise-style test automation architecture.
- UI and API automation integration.
- Reusable Page Object Model.
- TypeScript-based framework design.
- Cloud-based browser execution.
- Azure identity and authentication integration.
- CI/CD pipeline integration.
- Automated test reporting and failure diagnostics.
- Separation of framework configuration and test implementation.

## Author

**Kanak Raju Mulakalapalli**

AI Automation Architect | Lead SDET | Quality Engineering

GitHub: https://github.com/kanakarajum

LinkedIn: https://www.linkedin.com/in/kanakarajum/