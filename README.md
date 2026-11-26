# Enterprise Playwright UI & API Automation Framework

A modular end-to-end automation framework built with **Playwright, TypeScript, and Node.js**. It supports UI automation, API testing, reusable test architecture, local and CI execution, and cloud browser execution through **Azure Playwright Workspaces**.

## Architecture and technology stack

| Area | Technology |
|---|---|
| Automation | Playwright Test |
| Language / runtime | TypeScript / Node.js |
| UI testing | Playwright |
| API testing | Playwright APIRequestContext |
| Design pattern | Page Object Model (POM) |
| Test organization | Tag-based execution (`@Web`, `@API`) |
| Reporting | Playwright HTML, Allure, Azure Playwright reporter |
| CI/CD | Jenkins, GitHub Actions |
| Cloud browsers | Azure Playwright Workspaces |
| Azure authentication | Azure Identity / Azure CLI locally; Azure Login in GitHub Actions |
| Package manager | npm |

## Key capabilities

- **UI automation:** reusable page objects, centralized locators/actions, browser configuration, screenshots and traces.
- **API automation:** API request testing, reusable API utilities, and test-data support.
- **Framework architecture:** modular tests, utilities, helpers, types, test data, and centralized configuration.
- **Local execution:** run the full suite, UI-only tests, or API-only tests.
- **Jenkins CI:** pipeline for checkout, dependency installation, browser installation, UI test execution, and Allure result archival.
- **Azure cloud execution:** run Playwright tests using managed browsers in an Azure Playwright Workspace.
- **GitHub Actions + Azure:** automate cloud test execution on pushes, pull requests, or manual workflow dispatch; publish Azure test reports and upload GitHub artifacts.

## Project structure

```text
playwright-ui-api-Framework/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pageObjects/
├── testData/
├── tests/
├── types/
├── utils/
├── docs/
│   └── FRAMEWORK-SETUP-AND-EXECUTION.md
├── playwright.config.ts
├── playwright.config1.ts
├── playwright.service.config.ts
├── Jenkinsfile
├── package.json
└── README.md
```

## Prerequisites

- Node.js 22 or a compatible supported Node.js release
- npm and Git
- Playwright browser binaries for local browser execution
- Azure subscription and Azure Playwright Workspace for cloud execution
- Azure CLI for local Azure authentication
- Jenkins or GitHub Actions for CI/CD execution

## Installation

```bash
git clone https://github.com/kanakarajum/playwright-ui-api-Framework.git
cd playwright-ui-api-Framework
npm ci
npx playwright install
```

Install local browser binaries with `npx playwright install` when running browsers on your machine or Jenkins agent. Azure Workspaces provides remote browsers, so local browser installation is not needed just to submit a remote Azure run.

## Execution commands

| Purpose | Command |
|---|---|
| Run all tests locally | `npm run regression` |
| Run UI tests | `npm run webtests` |
| Run API tests | `npm run APITests` |
| Run the additional browser configuration | `npm run safariNewConfig` |
| Run tests on Azure Workspaces | `npm run runTestsOnAzure` |
| Generate Allure report | `npm run allure:generate` |
| Open Allure report | `npm run allure:open` |

The tag-based scripts select tests using `@Web` and `@API`. See `package.json` for the exact commands.

## Azure Playwright Workspaces

The Azure configuration is maintained separately in `playwright.service.config.ts`. It reuses the base Playwright configuration, connects to managed Azure browsers using `@azure/playwright`, and configures the Azure Playwright reporter.

For local Azure execution:

1. Sign in using Azure CLI: `az login`.
2. Set the correct subscription if necessary: `az account set --subscription "<SUBSCRIPTION_ID>"`.
3. Set `PLAYWRIGHT_SERVICE_URL` to the WebSocket endpoint copied from your Azure Playwright Workspace.
4. Ensure the signed-in identity has the required workspace permissions.
5. Run `npm run runTestsOnAzure`.

Do not commit credentials or local `.env` files.

## CI/CD

### Jenkins

The checked-in `Jenkinsfile` runs tests locally on the Jenkins agent. It checks out source, runs `npm ci`, installs Playwright browsers, executes `npm run webtestsAllure`, and archives `allure-results/**`.

The current Jenkinsfile uses Windows `bat` steps and expects a Jenkins NodeJS tool named `NodeJS-22`. Use a Windows agent as configured, or adapt the steps for a Linux agent.

### GitHub Actions + Azure

The workflow `.github/workflows/playwright.yml`:

- Runs on pushes to `main` or `master`, pull requests targeting those branches, and manual dispatch.
- Authenticates to Azure using `azure/login@v2` and the `AZURE_CREDENTIALS` GitHub repository secret.
- Installs npm dependencies with `npm ci`.
- Runs `npx playwright test --config=playwright.service.config.ts --workers=5`.
- Passes the Azure browser endpoint through the `PLAYWRIGHT_SERVICE_URL` repository variable.
- Publishes test reporting through the Azure Playwright reporter.
- Uploads the local `playwright-report/` folder as a GitHub Actions artifact when available.

Configure these under **GitHub repository → Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|---|---|---|
| Repository secret | `AZURE_CREDENTIALS` | Azure service principal JSON containing `clientId`, `clientSecret`, `subscriptionId`, and `tenantId` |
| Repository variable | `PLAYWRIGHT_SERVICE_URL` | Full WebSocket endpoint copied from the Azure Playwright Workspace |

The GitHub Actions service principal needs the appropriate role on the Playwright Workspace to execute tests. For Azure reporting artifact uploads, assign **Storage Blob Data Contributor** on the associated reporting storage account to that same service principal. Use least-privilege role assignments and store credentials only in GitHub Secrets.

**Important:** Azure report publishing and artifact upload can succeed even when some tests fail. Check the test results in the Azure report; a non-zero Playwright test exit code correctly marks the GitHub Actions test step as failed.

## Reporting

- **Local / Jenkins:** Allure result files are written to `allure-results/`. Jenkins currently archives these raw result files.
- **Azure:** Azure Playwright reporter publishes the run and supported diagnostic artifacts to the workspace reporting experience.
- **GitHub Actions:** the workflow uploads `playwright-report/` as a downloadable artifact (30-day retention in the current workflow).

## Detailed setup guide

For the complete, step-by-step instructions—including Jenkins job creation, Azure workspace setup, local Azure execution, GitHub secrets and variables, Azure role assignments, workflow execution, reporting, and troubleshooting—see:

**[Framework Setup and Execution Guide](docs/FRAMEWORK-SETUP-AND-EXECUTION.md)**

## Engineering practices demonstrated

- Enterprise-style Playwright framework architecture
- UI and API automation in one TypeScript project
- Reusable Page Object Model and utilities
- Tag-based test execution
- Local and cloud browser execution
- Azure identity and workspace integration
- Jenkins and GitHub Actions CI/CD
- HTML, Allure, and Azure test reporting
- Failure diagnostics using screenshots and traces

## Author

**Kanak Raju Mulakalapalli**  
AI Automation Architect | Lead SDET | Quality Engineering

- GitHub: [kanakarajum](https://github.com/kanakarajum)
- LinkedIn: [kanakarajum](https://www.linkedin.com/in/kanakarajum/)
