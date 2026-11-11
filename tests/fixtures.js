import { test as base, expect } from '@playwright/test';

// a 1 × 1 px PNG instead of the photos of picsum.photos, so the tests need no network
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

/**
 * `page` with the outside photos stubbed and `errors`: the errors of the page (uncaught exceptions, console errors,
 * requests of own files that failed), to be checked empty at the end of a test.
 */
export const test = base.extend({
	errors: async ({ page }, use) => {
		const errors = [];
		page.on('pageerror', (error) => errors.push(`exception: ${error.message}`));
		page.on('console', (message) => {
			if (message.type() === 'error') {
				errors.push(`console: ${message.text()}`);
			}
		});
		page.on('response', (response) => {
			if (response.status() >= 400) {
				errors.push(`${response.status()}: ${response.url()}`);
			}
		});
		await use(errors);
	},
	page: async ({ page }, use) => {
		await page.route(/^https?:\/\/(?!localhost)/, (route) => route.fulfill({ contentType: 'image/png', body: pixel }));
		await use(page);
	},
});

/** Opens a demo page and waits for its scripts (the modules are started on DOMContentLoaded). */
export async function open(page, file, { compact = false } = {}) {
	if (compact) {
		await page.addInitScript(() => localStorage.setItem('sidebar-compact', '1'));
	}
	await page.goto(file);
	await page.waitForLoadState('load');
}

export { expect };
