import fs from 'node:fs';
import { test, expect, open } from './fixtures.js';

// every source in demo/pages is built into a page of the same name
const pages = fs.readdirSync(new URL('../demo/pages', import.meta.url)).filter((file) => file.endsWith('.html')).sort();

test.describe('demo pages', () => {
	for (const file of pages) {
		test(`${file} loads without errors`, async ({ page, errors }) => {
			await open(page, file);
			await page.waitForLoadState('networkidle');

			await expect(page).toHaveTitle(/\S/);
			await expect(page.locator('body')).toContainText(/\S/);
			// nothing wider than the window
			expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
			expect(errors).toEqual([]);
		});
	}

	test('pages fit a phone', async ({ page, errors }) => {
		await page.setViewportSize({ width: 375, height: 700 });
		for (const file of ['index.html', 'datagrid.html', 'shop-products.html', 'blog-article.html', 'sign-in.html']) {
			await open(page, file);
			expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), file).toBe(0);
		}
		expect(errors).toEqual([]);
	});
});
