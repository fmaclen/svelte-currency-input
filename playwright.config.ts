import { type PlaywrightTestConfig, devices } from '@playwright/test';

const isEnvCI = process.env.NODE_ENV !== 'CI';

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
	retries: isEnvCI ? 3 : 0,
	use: {
		trace: isEnvCI ? undefined : 'retain-on-failure',
		screenshot: isEnvCI ? undefined : 'only-on-failure'
	},
	projects: isEnvCI ? enableMultipleBrowsers : undefined
};

export default config;
