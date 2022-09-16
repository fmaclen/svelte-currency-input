import { type PlaywrightTestConfig, devices } from '@playwright/test';

const multipleBrowsers = [
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
	projects: process.env.NODE_ENV === 'CI' ? multipleBrowsers : undefined
};

export default config;
