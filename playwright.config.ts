import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  projects: [ 
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    }
  ]
};

export default config;
