import { test, expect, open } from './fixtures.js';

const team = (page) => page.locator('#demo-team');
const order = (list) => list.locator(':scope > .sortable-item').evaluateAll((items) => items.map((item) => item.dataset.id));
const item = (page, id) => page.locator(`.sortable-item[data-id="${id}"]`);
const handle = (page, id) => item(page, id).locator(':scope > .sortable-handle');

/** Drags the item by its handle to the middle of the target, in small steps like a hand. */
async function drag(page, id, target, { below = false } = {}) {
	const from = await handle(page, id).boundingBox();
	const to = await target.boundingBox();
	await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
	await page.mouse.down();
	await page.mouse.move(to.x + 40, to.y + (below ? to.height * 0.8 : to.height * 0.2), { steps: 12 });
	await page.mouse.up();
}

test.describe('sortable', () => {
	test('the mouse moves an item by its handle and the list tells the change', async ({ page, errors }) => {
		await open(page, 'sortable.html');
		await page.evaluate(() => {
			window.changes = [];
			document.addEventListener('change.bs.sortable', (event) => window.changes.push([event.detail.oldIndex, event.detail.newIndex]));
		});

		await drag(page, '1', item(page, '3'), { below: true });
		expect(await order(team(page))).toEqual(['2', '3', '1', '4', '5']);
		expect(await page.evaluate(() => window.changes)).toEqual([[0, 2]]);
		// nothing of the drag stays in the page
		await expect(page.locator('.sortable-ghost, .sortable-placeholder')).toHaveCount(0);
		await expect(page.locator('html')).not.toHaveClass(/sortable-active/);

		// a drop at the same place is no change
		await drag(page, '2', item(page, '2'));
		expect(await page.evaluate(() => window.changes)).toHaveLength(1);
		expect(errors).toEqual([]);
	});

	test('the keyboard grabs, moves, drops and cancels', async ({ page }) => {
		await open(page, 'sortable.html');
		await handle(page, '1').focus();

		await page.keyboard.press('Space');
		await expect(handle(page, '1')).toHaveAttribute('aria-pressed', 'true');
		await expect(item(page, '1')).toHaveClass(/sortable-grabbed/);
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await expect(handle(page, '1')).toBeFocused();
		await page.keyboard.press('Space');
		expect(await order(team(page))).toEqual(['2', '3', '1', '4', '5']);
		await expect(handle(page, '1')).not.toHaveAttribute('aria-pressed');
		await expect(page.locator('.sortable-live')).toHaveText(/dropped, position 3 of 5/);

		await page.keyboard.press('Enter');
		await page.keyboard.press('ArrowUp');
		await page.keyboard.press('Escape');
		expect(await order(team(page))).toEqual(['2', '3', '1', '4', '5']);
	});

	test('a link moves into another section and into a group, a group stays out of groups', async ({ page }) => {
		await open(page, 'sortable.html');
		const system = page.locator('.sortable[data-sortable-group="menu"]').last();
		const nested = page.locator('.sortable-nested');

		// an empty section takes a link
		await drag(page, 'commerce.orders', system);
		expect(await order(system)).toEqual(['commerce.orders']);

		// a link goes into the group of Blog
		await drag(page, 'pages', item(page, 'blog.categories'), { below: true });
		expect(await order(nested)).toEqual(['blog.articles', 'blog.categories', 'pages', 'blog.comments']);

		// the keyboard goes on from the end of a list into the next one of the group
		await handle(page, 'admin.dashboard').focus();
		await page.keyboard.press('Space');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Space');
		expect(await order(page.locator('.sortable[data-sortable-group="menu"]').nth(1))).toContain('admin.dashboard');

		// the group of Blog is not dropped into a group
		await drag(page, 'blog', item(page, 'blog.comments'));
		expect(await order(nested)).not.toContain('blog');

		await expect(page.locator('#demo-menu-save')).toBeEnabled();
		await expect(page.locator('#demo-menu-order')).toContainText('"system"');
	});

	test('only a list of the same group takes an item', async ({ page }) => {
		await open(page, 'sortable.html');
		const commerce = item(page, 'commerce.products').locator('xpath=..');
		await drag(page, '1', item(page, 'commerce.products'));
		// on its way the item may pass its own list, it never leaves it
		expect(await order(team(page))).toContain('1');
		expect(await order(commerce)).toEqual(['commerce.products', 'commerce.orders']);

		// the keyboard stops at the end of a list without a group
		await handle(page, '5').focus();
		await page.keyboard.press('Space');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Space');
		expect((await order(team(page))).at(-1)).toBe('5');
	});
});
