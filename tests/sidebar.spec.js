import { test, expect, open } from './fixtures.js';

const html = (page) => page.locator('html');
const menu = (page) => page.locator('.sidebar-compact-menu');
const group = (page, name) => page.locator('.sidebar .list-link.link-arrow', { hasText: name });

// a click right after the menu scrolled a link into the view would be closed by that scroll
async function settle(page, link) {
	await link.scrollIntoViewIfNeeded();
	await page.waitForTimeout(150);
}

test.describe('sidebar menu', () => {
	test('a group opens and closes its submenu', async ({ page, errors }) => {
		await open(page, 'index.html');
		const shop = group(page, 'Shop');
		const submenu = page.locator(`#${await shop.getAttribute('aria-controls')}`);

		await expect(shop).toHaveAttribute('role', 'button');
		await expect(shop).toHaveAttribute('aria-expanded', 'false');
		await expect(submenu).toBeHidden();

		await shop.click();
		await expect(shop).toHaveAttribute('aria-expanded', 'true');
		await expect(submenu).toBeVisible();

		await shop.focus();
		await page.keyboard.press('Enter');
		await expect(shop).toHaveAttribute('aria-expanded', 'false');
		await expect(submenu).toBeHidden();
		expect(errors).toEqual([]);
	});

	test('the group of the current page is open and the page is marked', async ({ page }) => {
		await open(page, 'commerce.html');
		await expect(group(page, 'Commerce')).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('.sidebar .list-link[aria-current="page"]')).toHaveText(/Products/);
	});
});

test.describe('compact sidebar', () => {
	test('the button narrows the sidebar and the choice is remembered', async ({ page, errors }) => {
		await open(page, 'index.html');
		const button = page.locator('[data-sidebar-compact]');
		const width = () => page.locator('.sidebar-menu').evaluate((element) => element.getBoundingClientRect().width);

		await expect(button).toHaveAttribute('aria-pressed', 'false');
		expect(await width()).toBe(240);

		await button.click();
		await expect(html(page)).toHaveClass(/sidebar-compact/);
		await expect(button).toHaveAttribute('aria-pressed', 'true');
		expect(await width()).toBe(72);
		expect(await page.evaluate(() => localStorage.getItem('sidebar-compact'))).toBe('1');

		await page.reload();
		await expect(html(page)).toHaveClass(/sidebar-compact/);
		await expect(button).toHaveAttribute('aria-pressed', 'true');

		await button.click();
		await expect(html(page)).not.toHaveClass(/sidebar-compact/);
		expect(await width()).toBe(240);
		expect(await page.evaluate(() => localStorage.getItem('sidebar-compact'))).toBe('0');
		expect(errors).toEqual([]);
	});

	test('a hovered link shows its name, section titles are lines', async ({ page }) => {
		await open(page, 'index.html', { compact: true });
		const label = page.locator('.sidebar-compact-label');

		await page.locator('.sidebar .list-link', { hasText: 'Typography' }).hover();
		await expect(label).toBeVisible();
		await expect(label).toHaveText('Typography');

		await page.locator('main, .layout-content').first().hover();
		await expect(label).toBeHidden();

		// the first section has no line, the others one of 1px
		const heights = await page.locator('.sidebar .list-title').evaluateAll((titles) => titles.map((title) => title.getBoundingClientRect().height));
		expect(heights[0]).toBe(0);
		expect(heights.slice(1).every((height) => height === 1)).toBe(true);
	});

	test('a group opens its links in a menu next to the icon', async ({ page, errors }) => {
		await open(page, 'commerce.html', { compact: true });
		const shop = group(page, 'Shop');
		await settle(page, shop);

		await shop.click();
		await expect(menu(page)).toBeVisible();
		await expect(menu(page).locator('.sidebar-compact-menu-header')).toHaveText('Shop');
		await expect(menu(page).locator('.sidebar-compact-menu-item')).toHaveCount(8);
		await expect(shop).toHaveAttribute('aria-expanded', 'true');
		await expect(shop).toHaveAttribute('aria-controls', 'sidebar-compact-menu');

		// inside the window, next to the sidebar
		const box = await menu(page).boundingBox();
		expect(box.x).toBe(72);
		expect(box.y + box.height).toBeLessThanOrEqual(800);

		// the submenu of the wide sidebar keeps its state
		await shop.click();
		await expect(menu(page)).toHaveCount(0);
		await expect(shop).toHaveAttribute('aria-expanded', 'false');

		// the current page is marked in the menu of its group
		const commerce = group(page, 'Commerce');
		await settle(page, commerce);
		await commerce.click();
		await expect(menu(page).locator('.sidebar-compact-menu-item.active')).toHaveAttribute('aria-current', 'page');

		await page.locator('.content-box h1').first().click();
		await expect(menu(page)).toHaveCount(0);
		expect(errors).toEqual([]);
	});

	test('the menu of a group works by the keyboard', async ({ page }) => {
		await open(page, 'commerce.html', { compact: true });
		const shop = group(page, 'Shop');
		const items = menu(page).locator('.sidebar-compact-menu-item');
		await settle(page, shop);

		await shop.focus();
		await page.keyboard.press('Enter');
		await expect(items.first()).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(items.nth(1)).toBeFocused();
		await page.keyboard.press('ArrowUp');
		await expect(items.first()).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(menu(page)).toHaveCount(0);
		await expect(shop).toBeFocused();

		// Tab after the last link goes on from the icon
		await page.keyboard.press('Space');
		await items.last().focus();
		await page.keyboard.press('Tab');
		await expect(menu(page)).toHaveCount(0);
		await expect(group(page, 'Blog')).toBeFocused();
	});

	test('a scroll closes the menu and the focus returns to the icon', async ({ page }) => {
		await open(page, 'commerce.html', { compact: true });
		const shop = group(page, 'Shop');
		await settle(page, shop);

		await shop.focus();
		await page.keyboard.press('Enter');
		await expect(menu(page)).toBeVisible();

		await page.mouse.wheel(0, 300);
		await expect(menu(page)).toHaveCount(0);
		await expect(shop).toBeFocused();
	});

	test('a phone keeps the sliding menu', async ({ page, errors }) => {
		await page.setViewportSize({ width: 500, height: 800 });
		await open(page, 'index.html', { compact: true });
		const navigation = page.locator('#navigation');
		const toggler = page.locator('#sidebar');

		await expect(toggler).toHaveAttribute('aria-expanded', 'false');
		await toggler.click();
		await expect(navigation).toHaveClass(/sidebar-toggle/);
		await expect(toggler).toHaveAttribute('aria-expanded', 'true');
		expect(await page.locator('.sidebar-menu').evaluate((element) => element.getBoundingClientRect().width)).toBe(240);

		// a group opens its submenu in place, not a menu next to it
		const shop = group(page, 'Shop');
		await shop.click();
		await expect(shop).toHaveAttribute('aria-expanded', 'true');
		await expect(menu(page)).toHaveCount(0);

		await page.keyboard.press('Escape');
		await expect(navigation).not.toHaveClass(/sidebar-toggle/);
		await expect(toggler).toHaveAttribute('aria-expanded', 'false');
		expect(errors).toEqual([]);
	});
});
