import { type PlaywrightTestConfig, devices } from '@playwright/test';

const isEnvCI = process.env.CI;

const enableMultipleBrowsers = [
	{
		name: 'chromium',
		use: { ...devices['Desktop Chrome'] }
	},
	{
		name: 'firefox',
		use: { ...devices['Desktop Firefox'] }
	},
	{
		name: 'webkit',
		use: { ...devices['Desktop Safari'] }
	}
];

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run dev',
		port: 5173
	},
	workers: isEnvCI ? 1 : undefined,
	retries: isEnvCI ? 2 : 0,
	use: {
		trace: isEnvCI ? 'off' : 'retain-on-failure',
		screenshot: isEnvCI ? 'off' : 'only-on-failure'
	},
	projects: enableMultipleBrowsers
};

export default config;
