import 'dotenv/config';

import { defineConfig } from '@playwright/test';
import {
  createAzurePlaywrightConfig,
  ServiceOS,
} from '@azure/playwright';

import { AzureCliCredential } from '@azure/identity';
import config from './playwright.config';

const credential = new AzureCliCredential();

export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>',
    connectTimeout: 3 * 60 * 1000,
    os: ServiceOS.LINUX,
    credential,
    runName: 'Local-Azure-Playwright-Test',
  }),
  {
    reporter: [
      ['html', { open: 'never' }],
      ['@azure/playwright/reporter'],
    ],
  }
);
