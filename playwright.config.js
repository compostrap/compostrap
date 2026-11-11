import { defineConfig } from '@playwright/test';

// Smoke tests of the demo pages: the pages are built from demo/ and served by Vite, like `npm run dev`.
const port = 5188;

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${port}/`,
		browserName: 'chromium',
		viewport: { width: 1280, height: 800 },
		reducedMotion: 'reduce',
		trace: 'retain-on-failure',
	},
	webServer: {
		command: `npm run demo && npx vite --port ${port} --strictPort`,
		url: `http://localhost:${port}/index.html`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
