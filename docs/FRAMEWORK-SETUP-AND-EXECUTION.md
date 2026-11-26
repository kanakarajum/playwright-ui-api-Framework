# Framework Setup and Execution Guide

This guide explains how to install, configure, and execute the Playwright UI/API automation framework in four environments:

1. Jenkins CI (local browser execution).
2. Azure Playwright Workspaces (managed cloud browsers).
3. GitHub Actions integrated with Azure Playwright Workspaces.
4. GitHub Actions with parallel Playwright sharding on GitHub-hosted runners.

> **Important:** Jenkins runs tests on its agent, the Azure workflow runs tests on Azure Playwright Workspaces, and the sharding workflow runs local-browser tests on GitHub-hosted runners. These are three separate CI execution paths and are documented separately below.

## Table of contents

- [1. Framework overview](#1-framework-overview)
- [2. Prerequisites](#2-prerequisites)
- [3. Clone and install](#3-clone-and-install)
- [4. Run tests locally](#4-run-tests-locally)
- [5. Jenkins setup and execution](#5-jenkins-setup-and-execution)
- [6. Azure Playwright Workspaces setup](#6-azure-playwright-workspaces-setup)
- [7. Run tests on Azure from a developer machine](#7-run-tests-on-azure-from-a-developer-machine)
- [8. GitHub Actions + Azure integration](#8-github-actions--azure-integration)
- [9. Reports and artifacts](#9-reports-and-artifacts)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Security recommendations](#11-security-recommendations)
- [12. Useful references](#12-useful-references)
- [13. Verified GitHub Actions → Azure execution](#13-verified-github-actions--azure-execution)
- [14. GitHub Actions sharded execution](#14-github-actions-sharded-execution)

---

## 1. Framework overview

The framework uses:

- **Playwright Test** with TypeScript and Node.js.
- **Page Object Model (POM)** for UI test organization.
- **Playwright APIRequestContext** for API testing.
- Reusable utilities, test data, and TypeScript types.
- **Allure** and Playwright HTML reporting.
- **Jenkins** for CI execution.
- **Azure Playwright Workspaces** for managed cloud browser execution.
- **GitHub Actions** to trigger cloud execution and publish test artifacts.

### Execution options

| Execution mode | Command / entry point | Browser location |
|---|---|---|
| Local regression | `npm run regression` | Developer/Jenkins machine |
| Local UI tests | `npm run webtests` | Developer/Jenkins machine |
| Local API tests | `npm run APITests` | Developer/Jenkins machine |
| Azure Workspaces | `npm run runTestsOnAzure` | Azure-managed browsers |
| GitHub Actions + Azure | `playwright.yml` workflow | Azure-managed browsers |

### Important configuration files

| File | Purpose |
|---|---|
| `playwright.config.ts` | Main Playwright configuration for local runs |
| `playwright.service.config.ts` | Azure Playwright Workspaces configuration |
| `playwright.config1.ts` | Additional browser/project configuration |
| `Jenkinsfile` | Jenkins pipeline |
| `.github/workflows/playwright.yml` | GitHub Actions workflow |
| `package.json` | Dependencies and execution scripts |
| `.env` | Optional local environment variables; do not commit |

---

## 2. Prerequisites

Install or obtain the following:

1. Git.
2. Node.js 22 or a compatible supported Node.js release.
3. npm (included with Node.js).
4. Visual Studio Code or another TypeScript editor.
5. A browser supported by the project's Playwright configuration.
6. For Jenkins: a Jenkins server/agent and the NodeJS plugin.
7. For Azure execution: an Azure subscription, an Azure Playwright Workspace, and Azure CLI.
8. For GitHub Actions: a GitHub repository with Actions enabled and permission to configure repository secrets and variables.

Verify the local tools:

```bash
node --version
npm --version
git --version
```

For Azure execution, also verify:

```bash
az version
```

---

## 3. Clone and install

### Step 1 — Clone the repository

```bash
git clone https://github.com/kanakarajum/playwright-ui-api-Framework.git
cd playwright-ui-api-Framework
```

### Step 2 — Install dependencies

Use `npm ci` when a lockfile is available. It installs the dependency versions recorded by the project and is preferred for CI.

```bash
npm ci
```

For a new development environment where you intentionally want npm to resolve dependencies, use:

```bash
npm install
```

### Step 3 — Install local Playwright browsers

For a local machine or Jenkins agent that will execute browsers locally:

```bash
npx playwright install
```

On Linux CI agents, browser operating-system dependencies may also be required:

```bash
npx playwright install --with-deps
```

Azure Workspaces runs the browser remotely, so you do not need to install the browser binaries on the machine that submits the Azure test run. You still need the Node.js project dependencies.

---

## 4. Run tests locally

Run the commands from the repository root.

### Run all tests

```bash
npm run regression
```

Equivalent command:

```bash
npx playwright test
```

### Run UI tests

```bash
npm run webtests
```

This uses the `@Web` tag configured in the test titles/tags.

### Run API tests

```bash
npm run APITests
```

This uses the `@API` tag configured in the test titles/tags.

### Run the additional browser configuration

```bash
npm run safariNewConfig
```

The script name is retained from the existing `package.json`; inspect `playwright.config1.ts` to see the actual configured project/browser before using it.

### Useful direct Playwright commands

```bash
# List discovered tests
npx playwright test --list

# Run one test file
npx playwright test tests/example.spec.ts

# Run tests matching a title
npx playwright test -g "test title"

# Open the Playwright HTML report (when one was generated)
npx playwright show-report
```

---

## 5. Jenkins setup and execution

The repository already contains a `Jenkinsfile`. Its current pipeline performs a **local browser run on the Jenkins agent** and archives Allure result files.

### 5.1 Prepare Jenkins

1. Install Jenkins and make sure the Jenkins controller and agent are available.
2. Install the **NodeJS** Jenkins plugin.
3. In **Manage Jenkins → Tools**, configure a NodeJS installation named exactly `NodeJS-22`.
4. Install Git on the agent and configure the Git installation/credentials if the repository requires them.
5. Use a Windows agent for the existing `Jenkinsfile`, because it uses Windows `bat` steps.
6. Ensure the agent can access the internet to clone the repository and download npm/Playwright dependencies.

> If you use a Linux agent, change the pipeline's `bat '...'` commands to `sh '...'`.

### 5.2 Create a Jenkins Pipeline job

1. Open the Jenkins dashboard.
2. Select **New Item**.
3. Enter a job name, for example `Playwright-UI-API-Framework`.
4. Select **Pipeline**, then select **OK**.
5. Under **Pipeline**, choose **Pipeline script from SCM**.
6. Select **Git**.
7. Enter the repository URL:
   `https://github.com/kanakarajum/playwright-ui-api-Framework.git`
8. Add Git credentials if the repository is private.
9. Set the branch to `*/master` (or the branch you want to build).
10. Set the Script Path to `Jenkinsfile`.
11. Save the job.

### 5.3 Understand the existing Jenkins pipeline

The checked-in Jenkinsfile has these stages:

1. **Checkout** — checks out the configured source branch.
2. **Install Dependencies** — runs `npm ci`.
3. **Install Playwright Browsers** — runs `npx playwright install`.
4. **Execute Web Tests** — runs `npm run webtestsAllure`.
5. **Post action** — archives files under `allure-results/**`, even if the test stage fails.

The current Jenkinsfile uses:

```groovy
tools {
    nodejs 'NodeJS-22'
}
```

Make sure the configured NodeJS tool name in Jenkins matches exactly.

### 5.4 Run the Jenkins job

1. Open the pipeline job.
2. Select **Build Now**.
3. Open the running build.
4. Select **Console Output** to follow each stage.
5. After completion, open the build's **Artifacts** section to download archived Allure results.

### 5.5 Generate and view an Allure report

The project includes these npm scripts:

```bash
npm run allure:generate
npm run allure:open
```

These commands generate and open the report from the local `allure-results` directory. If you want Jenkins to publish a browsable Allure report in the Jenkins UI, install/configure the Jenkins Allure plugin and add an Allure post-build/pipeline publisher. Archiving `allure-results` alone stores the raw results; it does not automatically publish the interactive report.

### 5.6 Optional: execute against Azure from Jenkins

This is an optional extension. The existing Jenkinsfile does **not** currently use Azure cloud browsers. To run on Azure from Jenkins:

1. Complete the Azure workspace setup in section 6.
2. Give the Jenkins service principal the **Playwright Workspace Contributor** role on the workspace.
3. If using the Azure reporting uploader, grant the same service principal **Storage Blob Data Contributor** on the workspace's reporting storage account.
4. Install Azure CLI on the Jenkins agent.
5. Store the service principal client ID and secret as Jenkins credentials. Store the tenant ID securely as well.
6. Set `PLAYWRIGHT_SERVICE_URL` as a Jenkins environment variable using the endpoint copied from the Azure workspace.
7. Authenticate the agent with Azure CLI, then run the Azure configuration.

Example Windows-agent pipeline stage (replace the Jenkins credential IDs with the IDs you create):

```groovy
stage('Run tests on Azure Playwright Workspaces') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'azure-playwright-service-principal',
                usernameVariable: 'AZURE_CLIENT_ID',
                passwordVariable: 'AZURE_CLIENT_SECRET'
            ),
            string(
                credentialsId: 'azure-tenant-id',
                variable: 'AZURE_TENANT_ID'
            )
        ]) {
            bat '''
                az login --service-principal ^
                  --username "%AZURE_CLIENT_ID%" ^
                  --password "%AZURE_CLIENT_SECRET%" ^
                  --tenant "%AZURE_TENANT_ID%"
                npx playwright test --config=playwright.service.config.ts --workers=5
                az logout
            '''
        }
    }
}
```

Configure `PLAYWRIGHT_SERVICE_URL` in the Jenkins job or folder environment. Keep all credentials in Jenkins Credentials; never put a client secret in the Jenkinsfile or source control. For production use, consider a managed identity or a federated identity flow where your Jenkins environment supports it.

---

## 6. Azure Playwright Workspaces setup

Azure Playwright Workspaces provides managed remote browsers. The test code and Playwright runner execute on your machine/CI agent, while the browser session runs in Azure.

### 6.1 Create a workspace

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for **Playwright Workspaces**.
3. Select **Create**.
4. Choose the Azure subscription and resource group.
5. Enter a unique workspace name.
6. Choose the Azure region.
7. Select **Review + Create**, then **Create**.
8. Open the deployed workspace.

### 6.2 Copy the regional service endpoint

1. Open the workspace in Azure.
2. Open its **Get Started** page.
3. Find **Add region endpoint**.
4. Copy the complete browser endpoint. It should look like:

```text
wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers
```

Do not construct the URL manually. Copy the current value from the workspace because the region and workspace ID must match your resource.

### 6.3 Example workspace used for this repository

The integration documented and tested for this repository used the following Azure resources:

| Setting | Configured value |
|---|---|
| Resource group | `PWAutomationPractice` |
| Workspace | `playwrightAutomation3108` |
| Region | `East US` |
| Workspace ID | `f895e886-fe6f-4ac5-8f8c-1f64abe487a7` |
| Storage account for reporting artifacts | `pwstrgpwautomationpr98dc` |

The corresponding service endpoint used by this workspace is:

```text
wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/f895e886-fe6f-4ac5-8f8c-1f64abe487a7/browsers
```

For another workspace, replace this endpoint with the value shown in that workspace's **Get Started** page.

### 6.4 Configure workspace permissions

The identity that runs the tests must be authorized to run tests on the workspace.

1. In Azure portal, open the Playwright workspace.
2. Select **Access control (IAM)**.
3. Select **Add → Add role assignment**.
4. Assign **Playwright Workspace Contributor** to the user, service principal, or managed identity that will run the tests.
5. Save the assignment.

The **Playwright Workspace Reader** role is read-only and cannot run tests. Use the least-privilege role that supports the required operation.

### 6.5 Configure reporting storage permissions

When Playwright Workspaces reporting uploads screenshots, videos, traces, and related artifacts to the workspace storage account, the identity used by the CI job needs the required storage data-plane permission.

For this repository's GitHub Actions service principal, the role assignment that resolved the reporting upload authorization error was **Storage Blob Data Contributor** at the storage-account scope.

Example Azure CLI command:

```bash
az role assignment create \
  --assignee-object-id "<SERVICE_PRINCIPAL_OBJECT_ID>" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
```

Use the service principal **object ID**, not its application/client ID, for `--assignee-object-id`.

Allow time for Azure RBAC changes to propagate. If reporting still returns an authorization error, verify that the role is assigned to the identity actually used by the CI job and at the correct storage account scope.

---

## 7. Run tests on Azure from a developer machine

### 7.1 Sign in to Azure CLI

Install Azure CLI if it is not already installed, then run:

```bash
az login
az account show
```

If you have multiple subscriptions, select the correct one:

```bash
az account set --subscription "<SUBSCRIPTION_ID>"
```

The `playwright.service.config.ts` in this repository uses `AzureCliCredential`, so the Azure CLI identity is used to authenticate.

### 7.2 Configure the service endpoint

Create a local `.env` file in the repository root:

```dotenv
PLAYWRIGHT_SERVICE_URL=wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers
```

Replace the placeholder with the exact endpoint from your workspace. The repository's `.gitignore` already excludes `.env`.

### 7.3 Review the Azure Playwright configuration

The existing `playwright.service.config.ts`:

- Imports the base `playwright.config.ts`.
- Uses `createAzurePlaywrightConfig` from `@azure/playwright`.
- Uses `AzureCliCredential` from `@azure/identity`.
- Sets the remote browser operating system to Linux.
- Sets a three-minute connection timeout.
- Enables the `<loopback>` network exposure rule.
- Enables the Azure Playwright reporter and an HTML reporter.

The `<loopback>` setting is useful when the browser needs to access a local application exposed through the supported loopback tunnel. It does not automatically make arbitrary private networks accessible.

### 7.4 Execute on Azure

Run the project script:

```bash
npm run runTestsOnAzure
```

Or invoke Playwright directly:

```bash
npx playwright test --config=playwright.service.config.ts --workers=5
```

The npm script currently uses 10 workers; the GitHub Actions workflow uses 5 workers. Adjust worker counts based on workspace capacity, test stability, and execution time.

### 7.5 Verify the Azure run

1. Open the Azure portal.
2. Navigate to your Playwright workspace.
3. Open the test runs/reporting area.
4. Select the latest run.
5. Review passed, failed, and skipped tests.
6. Open failed tests to inspect their errors and attached artifacts.

A test run can be successfully created and its artifacts successfully uploaded even when one or more tests fail. The Playwright command will still return a non-zero exit code when tests fail; this is expected CI behavior.

---

## 8. GitHub Actions + Azure integration

This repository contains the workflow:

` .github/workflows/playwright.yml `

It runs on pushes to `main` or `master`, pull requests targeting those branches, and manual dispatch from the GitHub Actions page.

### 8.1 Verify the Azure identity

Create or use a Microsoft Entra application/service principal dedicated to GitHub Actions.

You will need:

- Application (client) ID.
- Service principal object ID.
- Tenant (directory) ID.
- Subscription ID.
- Client secret (only if using the current client-secret-based workflow).

The repository's current workflow uses `azure/login@v2` with the `AZURE_CREDENTIALS` JSON secret. The JSON value has this structure:

```json
{
  "clientId": "<APPLICATION_CLIENT_ID>",
  "clientSecret": "<CLIENT_SECRET>",
  "subscriptionId": "<SUBSCRIPTION_ID>",
  "tenantId": "<TENANT_ID>"
}
```

Create the JSON using your own values. Do not commit it to the repository or paste it into logs.

### 8.2 Assign Azure permissions

On the Playwright workspace, assign the GitHub Actions service principal the **Playwright Workspace Contributor** role (or a more privileged role only if genuinely required).

For reporting artifact uploads, assign **Storage Blob Data Contributor** to the same service principal at the storage account scope.

Example:

```bash
az role assignment create \
  --assignee-object-id "<GITHUB_ACTIONS_SERVICE_PRINCIPAL_OBJECT_ID>" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
```

Check the workspace role assignment separately in the workspace's **Access control (IAM)** page.

### 8.3 Add the GitHub repository secret

1. Open the GitHub repository.
2. Go to **Settings → Secrets and variables → Actions**.
3. Open the **Secrets** tab.
4. Select **New repository secret**.
5. Set the name to:

```text
AZURE_CREDENTIALS
```

6. Paste the JSON credentials object described above as the secret value.
7. Save.

GitHub hides a secret's value after it is saved. Seeing the secret name without being able to view its value is expected.

### 8.4 Add the GitHub repository variable

The workflow reads the service endpoint from a repository variable.

1. Stay in **Settings → Secrets and variables → Actions**.
2. Open the **Variables** tab.
3. Select **New repository variable**.
4. Set the name to:

```text
PLAYWRIGHT_SERVICE_URL
```

5. Set the value to the full WebSocket endpoint copied from the Azure workspace.
6. Save.

The URL is configuration, not a credential. Do not put a client secret or access token in a repository variable.

### 8.5 Understand the current workflow

The checked-in workflow follows this sequence:

1. **Checkout** — downloads the repository.
2. **Setup Node.js** — configures the Node.js LTS runtime and npm cache.
3. **Azure Login** — authenticates with the `AZURE_CREDENTIALS` secret.
4. **Install dependencies** — runs `npm ci`.
5. **Run Playwright tests on Azure** — executes:

   ```bash
   npx playwright test --config=playwright.service.config.ts --workers=5
   ```

   The `PLAYWRIGHT_SERVICE_URL` repository variable is passed to the process.

6. **Upload GitHub artifact** — uploads the local `playwright-report/` directory when the workflow has not been cancelled.

The Azure Playwright reporter separately publishes the test run and its reporting artifacts to the Azure workspace.

### 8.6 Trigger the workflow

**Automatic execution**

- Push a commit to `main` or `master`.
- Open or update a pull request targeting `main` or `master`.

**Manual execution**

1. Open the repository's **Actions** tab.
2. Select **Playwright Tests**.
3. Select **Run workflow**.
4. Choose the branch.
5. Select **Run workflow** again.

### 8.7 Review the results

After the workflow starts:

1. Open the workflow run in GitHub Actions.
2. Select the job.
3. Review the **Run Playwright tests on Azure** step.
4. Open the Azure report URL published in the step logs.
5. Review test outcomes and diagnostic artifacts in Azure.
6. Download the `playwright-report` artifact from the GitHub run if it was uploaded.

**Do not interpret an Azure artifact upload success as proof that all tests passed.** A run with failed tests can still publish its report and upload screenshots/traces successfully. The test step correctly exits with a failure status when tests fail.

### 8.8 Authentication hardening: consider GitHub OIDC

The current repository workflow uses a service principal client secret stored in `AZURE_CREDENTIALS`. This is the working configuration documented above.

For a longer-term production setup, consider replacing the client secret with GitHub OpenID Connect (OIDC) workload identity federation. OIDC avoids storing a long-lived Azure client secret in GitHub. This requires configuring a federated credential on the Entra application and updating the workflow to use `id-token: write` and the `client-id`, `tenant-id`, and `subscription-id` inputs of `azure/login@v2`. Do not switch authentication methods until the federated credential and Azure role assignments are configured and tested.

---

## 9. Reports and artifacts

### Local / Jenkins reporting

- Allure results are written to `allure-results/`.
- Generate the Allure report with `npm run allure:generate`.
- Open it with `npm run allure:open`.
- Jenkins currently archives `allure-results/**`.

### Azure reporting

The Azure Playwright reporter is configured in `playwright.service.config.ts`. When enabled and authorized, it publishes the test run and uploads supported artifacts such as screenshots, videos, and traces to the workspace reporting storage.

### GitHub Actions artifacts

The workflow also uploads `playwright-report/` as a GitHub Actions artifact named `playwright-report`, with a 30-day retention period in the current workflow.

These are separate reporting destinations:

- Azure Playwright Workspaces report — run details and Azure-hosted test artifacts.
- GitHub Actions artifact — downloadable files produced in the GitHub runner workspace.
- Allure — local/Jenkins Allure results, when the corresponding reporter is used.

---

## 10. Troubleshooting

### A. Azure login succeeds, but test run creation is unauthorized

- Confirm the workflow authenticated as the expected service principal.
- Confirm that identity has **Playwright Workspace Contributor** or an appropriate workspace role.
- Check the role assignment at the workspace resource scope.
- Allow time for Azure RBAC propagation.

### B. Reporting upload says Storage Blob Data Contributor is missing

- Identify the service principal used by the CI job.
- Assign **Storage Blob Data Contributor** to that service principal at the reporting storage account scope.
- Use the service principal object ID, not the application/client ID.
- Confirm that the reporting storage account is the one associated with the workspace.
- Retry after role assignment propagation.

### C. `PLAYWRIGHT_SERVICE_URL` is missing or the service cannot connect

- Confirm the variable is named exactly `PLAYWRIGHT_SERVICE_URL`.
- Confirm it contains the full WebSocket URL, including `wss://` and the final `/browsers` path.
- Copy the current endpoint from the Azure workspace's **Get Started** page.
- Confirm that the workspace ID and region match the endpoint.
- Confirm the agent can reach the Azure service endpoint.

### D. Tests work on Windows but fail on GitHub's Linux runner

Linux file paths are case-sensitive. For example:

```typescript
// Correct when the directory is named "utils"
import ApiUtils from '../utils/apiUtils';
```

Check import path capitalization against the exact file and directory names committed to Git.

### E. Azure report uploads successfully, but the GitHub test step is marked failed

This usually means the test command returned a non-zero exit code because one or more tests failed. Report creation and artifact upload can still succeed. Open the Azure report and inspect the test results; do not change Azure authentication or storage permissions unless the logs show an authorization/connectivity error.

### F. Jenkins cannot find NodeJS or npm

- Confirm the NodeJS plugin is installed.
- Confirm the configured tool name is exactly `NodeJS-22`.
- Confirm NodeJS is available to the agent running the job.
- Check `node --version` and `npm --version` in the Jenkins console.

### G. Jenkins reports that `bat` is not recognized

The existing Jenkinsfile is written for a Windows agent. Use a Windows agent, or change the commands to `sh 'npm ci'`, `sh 'npx playwright install'`, and `sh 'npm run webtestsAllure'` for Linux.

---

## 11. Security recommendations

- Never commit `.env`, client secrets, passwords, or access tokens.
- Keep `.env` in `.gitignore`.
- Store CI credentials in GitHub Secrets or Jenkins Credentials.
- Prefer Microsoft Entra ID authentication over long-lived Playwright access tokens.
- Prefer GitHub OIDC over a stored client secret when the environment is configured for workload identity federation.
- Grant only the Azure roles needed by each identity and scope them to the workspace/storage account where possible.
- Rotate a client secret if it is accidentally exposed.
- Avoid printing credentials or access tokens in CI logs.

---

## 12. Useful references

- [Repository](https://github.com/kanakarajum/playwright-ui-api-Framework)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright Workspaces quickstart for CI](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/quickstart-automate-end-to-end-testing)
- [Azure Playwright configuration options](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/how-to-use-service-config-file)
- [Manage Playwright Workspace access](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/how-to-manage-workspace-access)
- [Manage Playwright Workspaces](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/how-to-manage-playwright-workspace)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Jenkins Pipeline documentation](https://www.jenkins.io/doc/book/pipeline/)

---

## 13. Verified GitHub Actions → Azure execution

This section records the end-to-end validation performed for this repository. It is a reference to the actual run, not a claim that every test passed.

### 13.1 Validated execution path

The successful integration path is:

1. A push, pull request, or manual workflow dispatch starts `.github/workflows/playwright.yml`.
2. GitHub Actions checks out the repository and configures Node.js.
3. `azure/login@v2` authenticates using the `AZURE_CREDENTIALS` repository secret.
4. `npm ci` installs the project dependencies.
5. The workflow runs `npx playwright test --config=playwright.service.config.ts --workers=5`.
6. The workflow passes `PLAYWRIGHT_SERVICE_URL` to the test process.
7. The Azure Playwright reporter creates the run and uploads supported diagnostics to the workspace reporting storage.
8. GitHub Actions uploads the local `playwright-report/` directory as the `playwright-report` artifact.

### 13.2 Verified Azure resources and permissions

The validation used the workspace and storage account documented in section 6.3.

The GitHub Actions service principal was assigned:

- **Playwright Workspace Contributor** at the Playwright Workspace scope, to authorize remote test execution.
- **Storage Blob Data Contributor** at the associated storage-account scope, to authorize reporting artifact uploads.

For the storage role assignment, use the service principal's **object ID** as `--assignee-object-id`; do not use its application/client ID. The role assignment should be scoped to the storage account associated with the workspace. Azure RBAC changes can take time to propagate.

Example command (replace the placeholders with your own resource details):

```bash
az role assignment create \
  --assignee-object-id "<SERVICE_PRINCIPAL_OBJECT_ID>" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
```

### 13.3 Actual validation result

The following run confirms that the GitHub-to-Azure integration and report publishing path worked:

| Item | Result |
|---|---|
| GitHub Actions run | [Run #45890826819](https://github.com/kanakarajum/playwright-ui-api-Framework/actions/runs/45890826819) |
| Azure Playwright test run ID | `63356715-65c8-4bed-873e-e78f54ba7d5a` |
| Azure report | [Open report in Azure portal](https://ms.portal.azure.com/#view/Microsoft_Azure_CloudNativeTesting/TestReport.ReactView/testRunId/63356715-65c8-4bed-873e-e78f54ba7d5a/resourceId/%2Fsubscriptions%2Fadd32b9a-6288-44a1-8f8c-ec1df5fcb2a4%2Fresourcegroups%2Fpwautomationpractice%2Fproviders%2Fmicrosoft.loadtestservice%2Fplaywrightworkspaces%2Fplaywrightautomation3108) |
| Test results | 9 passed, 7 failed |
| Azure reporting upload | Successful |
| GitHub `playwright-report` artifact upload | Successful |
| Overall test job | Failed because Playwright returned exit code 1 for failed tests |

**How to interpret this result:** Azure login, workspace test-run creation, and Azure reporting artifact upload all succeeded. The test job is still correctly marked failed because seven tests failed. A report upload success is not a passing test status.

The GitHub Actions artifact can be downloaded from the workflow run's **Artifacts** section. The Azure report provides the Azure-hosted run details and diagnostics.

### 13.4 Re-run and validate the integration

1. Confirm the `AZURE_CREDENTIALS` repository secret is configured and valid.
2. Confirm `PLAYWRIGHT_SERVICE_URL` contains the full WebSocket endpoint copied from the workspace's **Get Started** page.
3. Confirm the service principal has the workspace role and storage data role described above.
4. Open the repository's **Actions** tab and select **Playwright Tests**.
5. Select **Run workflow**, choose the branch, and start the workflow. The checked-in workflow also runs on pushes and pull requests targeting `main` or `master`.
6. Open the run and inspect the **Run Playwright tests on Azure** step.
7. If the Azure report URL appears in the logs, open it and review the test outcomes and diagnostics.
8. Download the `playwright-report` artifact from the run if it was uploaded.

If report publishing fails with a storage authorization error, troubleshoot the service principal's Storage Blob Data Contributor assignment and scope. If reporting succeeds but the test step fails, inspect the test results; do not treat a test assertion failure as an Azure authentication or storage issue.

---

## 14. GitHub Actions sharded execution

This repository has a second GitHub Actions workflow for parallel execution using Playwright's built-in sharding feature:

```text
.github/workflows/playwright_docker.yml
```

> **Naming note:** The filename currently contains `docker`, but the workflow does not use Docker. It runs directly on GitHub-hosted `ubuntu-latest` runners. The filename is retained here to match the checked-in repository path.

Unlike section 8, which runs tests remotely on Azure Playwright Workspaces, this workflow uses the base `playwright.config.ts` and installs browser binaries on GitHub-hosted runners.

### 14.1 How the sharding design works

The workflow uses a GitHub Actions matrix to create four independent jobs:

| Shard job | Playwright shard argument | Workers per runner |
|---|---|---:|
| Shard 1 | `--shard=1/4` | 4 |
| Shard 2 | `--shard=2/4` | 4 |
| Shard 3 | `--shard=3/4` | 4 |
| Shard 4 | `--shard=4/4` | 4 |

Each job checks out the same commit, installs dependencies and browsers, and runs only its assigned portion of the test suite. With four shard jobs and four workers per job, the workflow can run up to **16 workers concurrently** (subject to GitHub-hosted runner availability and scheduling).

The matrix configuration is:

```yaml
strategy:
  fail-fast: false
  matrix:
    shardIndex: [1, 2, 3, 4]
    shardTotal: [4]
```

- `shardIndex` identifies the current shard.
- `shardTotal` is the total number of shards.
- `fail-fast: false` allows the other shard jobs to continue if one shard fails.

Playwright distributes the tests across the shard jobs. Sharding is different from workers: **shards distribute tests across separate CI jobs/runners; workers execute tests concurrently inside each runner.**

### 14.2 Execution command

Each matrix job runs the following command, with GitHub Actions substituting the current matrix values:

```bash
npx playwright test \
  --config=playwright.config.ts \
  --workers=4 \
  --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }} \
  --reporter=blob
```

The workflow uses `playwright.config.ts`, not `playwright.service.config.ts`. Therefore this path uses the browser installed on the GitHub-hosted runner; it does not require the Azure workspace URL, Azure login, or Azure credentials.

### 14.3 Why the blob reporter is used

A normal HTML report generated independently by each shard would be separate. The Playwright **blob reporter** creates a report package that can be combined after all shard jobs finish.

The workflow follows this sequence:

1. Each shard executes its assigned tests using `--reporter=blob`.
2. Each shard uploads a uniquely named artifact: `blob-report-1`, `blob-report-2`, `blob-report-3`, or `blob-report-4`.
3. The `merge-reports` job waits for the `playwright-tests` matrix jobs.
4. The merge job downloads all artifacts matching `blob-report-*` into `all-blob-reports`.
5. It runs:

   ```bash
   npx playwright merge-reports --reporter html ./all-blob-reports
   ```

6. The merged report is uploaded as `html-report--attempt-<RUN_ATTEMPT>`.

The configured artifact retention is:

| Artifact | Retention |
|---|---:|
| Individual shard blob reports | 1 day |
| Consolidated HTML report | 14 days |

The merge job uses `if: ${{ !cancelled() }}` so it can still aggregate the available shard reports when one or more shards fail. This is important: **a successful merge job does not mean all tests passed.** The shard job results remain the source of truth for the overall test outcome.

### 14.4 Trigger the sharding workflow

The workflow supports manual and automatic triggers.

**Manual run**

1. Open the repository on GitHub.
2. Select **Actions**.
3. Select **Playwright Tests using Shards**.
4. Select **Run workflow**.
5. Choose the branch and select **Run workflow** again.

**Automatic runs**

- Push a commit to `main` or `master`.
- Open or update a pull request targeting `main` or `master`.

### 14.5 Review the sharded run and merged report

1. Open the workflow run in GitHub Actions.
2. Review the four `playwright-tests` shard jobs independently.
3. Open a failed shard's **Run Playwright tests** step to inspect its test failures, retries, screenshots, and traces.
4. Open the `merge-reports` job and confirm that it downloaded the blob artifacts and completed **Merge into HTML Report**.
5. Download the `html-report--attempt-<RUN_ATTEMPT>` artifact from the run's **Artifacts** section.
6. Open the extracted HTML report locally to review the combined results from all available shards.

**Verified execution:** [Run #45902717278](https://github.com/kanakarajum/playwright-ui-api-Framework/actions/runs/45902717278), triggered by a push to `master`.

| Component | Observed result |
|---|---|
| Shard 1 | Completed; tests failed |
| Shard 2 | Completed; tests failed |
| Shard 3 | Completed; tests failed |
| Shard 4 | Completed; all tests in this shard passed |
| Blob report uploads | All four shard artifacts uploaded |
| Merge job | Successful |
| Consolidated HTML artifact | Uploaded successfully |
| Overall workflow | Failed because three shard jobs reported test failures |

The failed tests showed application/test issues such as dialog handling, strict-mode locator matches, and locator timeouts. The sharding infrastructure itself worked: all four jobs ran, each uploaded its blob report, and the merge job produced the consolidated HTML report. These test failures were not changed as part of the sharding documentation.

### 14.6 Tuning shard and worker counts

The current configuration is four shards with four workers per shard. Tune these values based on suite size, GitHub runner limits, test isolation, application capacity, and observed execution time.

- Increase the number of shards when the suite is large enough to benefit from additional independent runners.
- Adjust `--workers` to control concurrency inside each runner.
- Avoid increasing both values without considering the combined concurrency. For example, 4 shards × 4 workers means up to 16 concurrent tests.
- Keep `fail-fast: false` when you want all shards to finish and produce diagnostics even if some tests fail.
- Review test isolation and shared test data before increasing parallelism; tests that modify the same account or application state may interfere with one another.

For this repository, the base configuration currently declares the Chromium project. The workflow's browser installation step can be made more efficient by installing only Chromium (for example, `npx playwright install --with-deps chromium`) rather than downloading every supported browser.

### 14.7 Sharding versus Azure cloud execution

| Capability | GitHub-hosted sharding | Azure Playwright Workspaces |
|---|---|---|
| Workflow file | `.github/workflows/playwright_docker.yml` | `.github/workflows/playwright.yml` |
| Playwright config | `playwright.config.ts` | `playwright.service.config.ts` |
| Browser execution | GitHub-hosted runner | Azure-managed remote browser |
| Parallelism | 4 shards × 4 workers in current workflow | 5 workers in current GitHub Actions workflow |
| Authentication | No Azure login required | Azure service principal via GitHub Secrets |
| Reporting | Blob reports merged into one HTML report | Azure Playwright reporter plus GitHub artifact |
| Main use | Parallelize local-browser CI tests | Execute tests on managed Azure browsers |

Use the sharding workflow when you want to distribute the suite across GitHub-hosted runners. Use the Azure workflow when you want managed remote browsers and Azure-hosted test reporting. They are independent workflows and can be run separately.

---

**Maintainer:** Kanak Raju Mulakalapalli  
**Framework:** Playwright + TypeScript + API Automation + Jenkins + Azure Playwright Workspaces + GitHub Actions
