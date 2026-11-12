import { test, expect, open } from './fixtures.js';

test.describe('theme switcher', () => {
	test('the segmented control of the user menu sets and remembers the theme', async ({ page, errors }) => {
		await open(page, 'index.html');
		const html = page.locator('html');
		const choice = (value) => page.locator(`[data-theme-value="${value}"]`);

		await page.locator('.navbar-user').click();
		await choice('dark').click();
		await expect(html).toHaveAttribute('data-bs-theme', 'dark');
		await expect(choice('dark')).toHaveAttribute('aria-pressed', 'true');
		await expect(choice('light')).toHaveAttribute('aria-pressed', 'false');
		// the menu stays open after a choice
		await expect(choice('light')).toBeVisible();

		await page.reload();
		await expect(html).toHaveAttribute('data-bs-theme', 'dark');

		await page.locator('.navbar-user').click();
		await choice('light').click();
		await expect(html).toHaveAttribute('data-bs-theme', 'light');
		expect(errors).toEqual([]);
	});

	test('auto follows the system and its changes', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await open(page, 'index.html');
		const html = page.locator('html');

		await page.locator('.navbar-user').click();
		await page.locator('[data-theme-value="auto"]').click();
		await expect(html).toHaveAttribute('data-bs-theme', 'dark');

		await page.emulateMedia({ colorScheme: 'light' });
		await expect(html).toHaveAttribute('data-bs-theme', 'light');

		// a stored auto is resolved before the page is drawn
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();
		await expect(html).toHaveAttribute('data-bs-theme', 'dark');
	});

	test('the toggle of the sign-in page switches light and dark', async ({ page }) => {
		await open(page, 'sign-in.html');
		const html = page.locator('html');
		const toggle = page.locator('[data-theme-switcher]');

		await expect(html).toHaveAttribute('data-bs-theme', 'light');
		await toggle.click();
		await expect(html).toHaveAttribute('data-bs-theme', 'dark');
		await expect(toggle).toHaveAttribute('aria-pressed', 'true');
		await toggle.click();
		await expect(html).toHaveAttribute('data-bs-theme', 'light');
		// back at the theme of the system the page follows it again instead of being pinned
		expect(await page.evaluate(() => localStorage.getItem('bootstrap-theme'))).toBe('auto');
	});

	test('without a stored choice the page follows the system', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await open(page, 'index.html');
		const html = page.locator('html');
		const auto = page.locator('[data-theme-value="auto"]');

		await expect(html).toHaveAttribute('data-bs-theme', 'dark');
		await expect(auto).toHaveAttribute('aria-pressed', 'true');
		// the auto choice tells the theme of the system
		await expect(auto).toHaveAttribute('data-theme-system', 'dark');
		await expect(auto).toHaveAttribute('title', 'System theme: dark');

		await page.emulateMedia({ colorScheme: 'light' });
		await expect(html).toHaveAttribute('data-bs-theme', 'light');
		await expect(auto).toHaveAttribute('data-theme-system', 'light');
	});

	test('a choice made in another tab is taken over', async ({ page, context }) => {
		await open(page, 'index.html');
		const other = await context.newPage();
		await open(other, 'index.html');

		await other.locator('.navbar-user').click();
		await other.locator('[data-theme-value="dark"]').click();

		await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
		await expect(page.locator('[data-theme-value="dark"]')).toHaveAttribute('aria-pressed', 'true');
	});
});

test.describe('number input', () => {
	test('the buttons step the value and stop at min and max', async ({ page, errors }) => {
		await open(page, 'inputs.html');
		const input = page.locator('#num-qty');
		const box = page.locator('.number-input', { has: input });
		const down = box.locator('[data-number-input="down"]');
		const up = box.locator('[data-number-input="up"]');
		await input.evaluate((element) => {
			window.numberEvents = [];
			for (const type of ['input', 'change']) {
				element.addEventListener(type, () => window.numberEvents.push(type));
			}
		});

		await expect(input).toHaveValue('1');
		await expect(down).toBeDisabled();

		await up.click();
		await expect(input).toHaveValue('2');
		await expect(down).toBeEnabled();
		expect(await page.evaluate(() => window.numberEvents)).toEqual(['input', 'change']);

		await input.fill('10');
		await expect(up).toBeDisabled();
		await down.click();
		await expect(input).toHaveValue('9');
		await expect(up).toBeEnabled();
		expect(errors).toEqual([]);
	});
});

test.describe('otp input', () => {
	test('a code is typed into its slots, pasted and completed', async ({ page, errors }) => {
		await open(page, 'inputs.html');
		const input = page.locator('#otp-code');
		const box = page.locator('.otp', { has: input });
		const slots = box.locator('.otp-slot');
		await box.evaluate((element) => {
			window.otpEvents = [];
			for (const type of ['input.bs.otpInput', 'complete.bs.otpInput']) {
				element.addEventListener(type, (event) => window.otpEvents.push(`${type.split('.')[0]}:${event.value}`));
			}
		});

		await expect(box).toHaveClass(/otp-rendered/);
		await expect(slots).toHaveCount(6);
		await expect(input).toHaveAttribute('inputmode', 'numeric');
		await expect(input).toHaveAttribute('autocomplete', 'one-time-code');

		// letters are thrown away, a digit fills a slot and the next one is the current
		await input.focus();
		await expect(slots.nth(0)).toHaveClass(/otp-slot-active/);
		await page.keyboard.type('a1b2');
		await expect(input).toHaveValue('12');
		await expect(slots.nth(1)).toHaveText('2');
		await expect(slots.nth(2)).toHaveClass(/otp-slot-active/);

		await page.keyboard.press('Backspace');
		await expect(input).toHaveValue('1');
		await expect(slots.nth(1)).toHaveClass(/otp-slot-active/);

		// a click on a filled slot chooses it, the next key replaces its character
		const first = await slots.nth(0).boundingBox();
		await page.mouse.click(first.x + first.width / 2, first.y + first.height / 2);
		await expect(slots.nth(0)).toHaveClass(/otp-slot-active/);
		await page.keyboard.type('9');
		await expect(input).toHaveValue('9');

		// a pasted code is cleaned and replaces the value
		await input.evaluate((element) => {
			const clipboardData = new DataTransfer();
			clipboardData.setData('text', '123 456');
			element.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
		});
		await expect(input).toHaveValue('123456');
		await expect(slots.nth(5)).toHaveText('6');
		await expect(page.locator('#otp-code-state')).toHaveText('Complete: 123456.');
		expect(await page.evaluate(() => window.otpEvents)).toEqual(['input:1', 'input:12', 'input:1', 'input:9', 'input:123456', 'complete:123456']);

		// a mask hides the characters, groups put a separator between them, a disabled code takes nothing
		await page.locator('#otp-pin').focus();
		await page.keyboard.type('12');
		await expect(page.locator('#otp-pin')).toHaveValue('12');
		await expect(page.locator('.otp', { has: page.locator('#otp-pin') }).locator('.otp-slot').first()).toHaveText('•');
		await expect(page.locator('.otp', { has: page.locator('#otp-groups') }).locator('.otp-separator')).toHaveCount(1);
		await expect(page.locator('#otp-alnum')).toHaveValue('A7K');
		expect(errors).toEqual([]);
	});

	test('the code of the password recovery fills the width of its form', async ({ page, errors }) => {
		await open(page, 'recovery.html');
		await page.locator('[data-recovery-next="2"]').first().click();
		const input = page.locator('#rec-code');
		const slots = page.locator('.otp', { has: input }).locator('.otp-slot');

		await expect(input).toBeFocused();
		await expect(slots).toHaveCount(6);
		await expect(slots.nth(0)).toHaveClass(/otp-slot-active/);
		await page.keyboard.type('482913');
		await expect(input).toHaveValue('482913');
		await expect(slots.nth(5)).toHaveClass(/otp-slot-active/);
		expect(errors).toEqual([]);
	});
});

test.describe('password toggle and strength', () => {
	test('the button shows the password, the meter rates it', async ({ page, errors }) => {
		await open(page, 'sign-up.html');
		const input = page.locator('#up-password');
		const button = page.locator('.password-toggle', { has: input }).locator('[data-password-toggle]');
		const meter = page.locator('.strength[data-bs-strength]');

		await expect(page.locator('html')).toHaveAttribute('data-password-toggle', '');
		await expect(input).toHaveAttribute('type', 'password');

		await input.fill('abc');
		await expect(meter).toHaveAttribute('data-bs-strength', 'weak');
		await expect(meter.locator('.strength-segment.active')).toHaveCount(1);

		await button.click();
		await expect(input).toHaveAttribute('type', 'text');
		await expect(button).toHaveAttribute('aria-pressed', 'true');

		// a shown password is rated too
		await input.fill('Correct-Horse-Battery-9!');
		await expect(meter).toHaveAttribute('data-bs-strength', 'strong');
		await expect(meter.locator('.strength-segment.active')).toHaveCount(4);

		await input.fill('');
		await expect(meter).toHaveAttribute('data-bs-strength', '');
		await expect(meter.locator('.strength-segment.active')).toHaveCount(0);

		// a shown password is sent as a password again
		await input.fill('secret');
		await input.evaluate((element) => {
			element.form.addEventListener('submit', (event) => event.preventDefault());
			element.form.noValidate = true;
			element.form.requestSubmit();
		});
		await expect(input).toHaveAttribute('type', 'password');
		await expect(button).toHaveAttribute('aria-pressed', 'false');
		expect(errors).toEqual([]);
	});
});

test.describe('row selection', () => {
	test('checked rows show the bar with their count', async ({ page, errors }) => {
		await open(page, 'datagrid.html');
		const wrapper = page.locator('[data-selection]').first();
		const all = wrapper.locator('[data-selection-all]');
		const items = wrapper.locator('[data-selection-item]');
		const bar = wrapper.locator('[data-selection-bar]');
		const count = wrapper.locator('[data-selection-count]');
		const total = await items.count();

		await expect(bar).toBeHidden();

		await items.first().check();
		await expect(bar).toBeVisible();
		await expect(count).toHaveText('1');
		await expect(wrapper.locator('tr.table-active')).toHaveCount(1);
		expect(await all.evaluate((element) => element.indeterminate)).toBe(true);

		await all.check();
		await expect(count).toHaveText(String(total));
		await expect(wrapper.locator('tr.table-active')).toHaveCount(total);
		expect(await all.evaluate((element) => element.indeterminate)).toBe(false);

		await bar.locator('.btn-close[data-selection-clear]').click();
		await expect(bar).toBeHidden();
		await expect(all).not.toBeChecked();
		await expect(wrapper.locator('tr.table-active')).toHaveCount(0);
		expect(errors).toEqual([]);
	});
});

test.describe('dialogs', () => {
	test('a click outside keeps a modal and an offcanvas open, the cross closes them', async ({ page, errors }) => {
		await open(page, 'overlays.html');

		for (const [id, dismiss] of [['#demo-modal', 'modal'], ['#demo-offcanvas', 'offcanvas']]) {
			const dialog = page.locator(id);
			await page.locator(`[data-bs-target="${id}"]`).first().click();
			await expect(dialog).toBeVisible();
			await expect(dialog).not.toHaveClass(/showing/);

			await page.mouse.click(5, 300);
			await page.waitForTimeout(500);
			await expect(dialog).toBeVisible();

			await dialog.locator(`.btn-close[data-bs-dismiss="${dismiss}"]`).click();
			await expect(dialog).toBeHidden();
		}
		expect(errors).toEqual([]);
	});

	test('the search still closes by a click outside', async ({ page, errors }) => {
		await open(page, 'overlays.html');
		const search = page.locator('#demo-search');

		await page.locator('[data-bs-target="#demo-search"]').first().click();
		await expect(search).toBeVisible();
		await page.mouse.click(5, 300);
		await expect(search).toBeHidden();
		expect(errors).toEqual([]);
	});
});

test.describe('gallery', () => {
	test('the lightbox opens, browses and closes', async ({ page, errors }) => {
		await open(page, 'gallery.html');
		const links = page.locator('[data-lightbox="demo-gallery"]');
		const dialog = page.locator('dialog.lightbox');
		const counter = dialog.locator('.lightbox-counter');
		const total = await links.count();

		// the links stand in the actions of a tile, shown on hover: the click is sent to the link itself
		await links.first().dispatchEvent('click');
		await expect(dialog).toBeVisible();
		await expect(counter).toHaveText(`1 / ${total}`);
		await expect(dialog.locator('.lightbox-caption')).toHaveText(await links.first().getAttribute('data-caption'));
		await expect(dialog.locator('.lightbox-image')).toHaveAttribute('src', await links.first().getAttribute('href'));

		await page.keyboard.press('ArrowRight');
		await expect(counter).toHaveText(`2 / ${total}`);
		await dialog.locator('.lightbox-prev').click();
		await dialog.locator('.lightbox-prev').click();
		await expect(counter).toHaveText(`${total} / ${total}`);

		// the page under the preview does not scroll and keeps its scrollbar (nothing shifts); in a low window,
		// where the page has something to scroll
		await page.setViewportSize({ width: 1280, height: 400 });
		expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeGreaterThan(0);
		const scroll = () => page.evaluate(() => ({ y: scrollY, width: document.documentElement.clientWidth }));
		const before = await scroll();
		await page.mouse.move(640, 200);
		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(200);
		expect(await scroll()).toEqual(before);
		expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY)).not.toBe('hidden');

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		await expect(page.locator('html')).not.toHaveClass(/lightbox-open/);
		expect(errors).toEqual([]);
	});

	test('the dropzone lists the chosen files', async ({ page, errors }) => {
		await open(page, 'gallery.html');
		const zone = page.locator('.dropzone').first();
		const input = zone.locator('.dropzone-input');

		await input.setInputFiles([
			{ name: 'first.png', mimeType: 'image/png', buffer: Buffer.from('a') },
			{ name: 'second.png', mimeType: 'image/png', buffer: Buffer.from('b') },
		]);
		await expect(zone.locator('[data-dropzone-files]')).toHaveText('first.png, second.png');

		await input.dispatchEvent('dragenter');
		await expect(zone).toHaveClass(/is-dragover/);
		await input.dispatchEvent('dragleave');
		await expect(zone).not.toHaveClass(/is-dragover/);
		expect(errors).toEqual([]);
	});
});

test.describe('product photos of the shop', () => {
	test('a thumbnail shows its photo, the big photo opens the lightbox at it', async ({ page, errors }) => {
		await open(page, 'shop-product.html');
		const thumbs = page.locator('.shop-detail-thumb');
		const dialog = page.locator('dialog.lightbox');
		const third = await thumbs.nth(2).getAttribute('href');

		// a thumbnail only changes the big photo
		await thumbs.nth(2).click();
		await expect(page.locator('.shop-detail-main')).toHaveAttribute('src', third);
		await expect(thumbs.nth(2)).toHaveClass(/active/);
		await expect(dialog).toHaveCount(0);
		await expect(page).toHaveURL(/shop-product.html$/);

		// the big photo is counted once among the photos
		await page.locator('.shop-detail-zoom').click();
		await expect(dialog).toBeVisible();
		await expect(dialog.locator('.lightbox-counter')).toHaveText('3 / 4');
		await expect(dialog.locator('.lightbox-image')).toHaveAttribute('src', third);

		await page.keyboard.press('ArrowRight');
		await expect(dialog.locator('.lightbox-counter')).toHaveText('4 / 4');
		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		expect(errors).toEqual([]);
	});
});

test.describe('datepicker', () => {
	test('a chosen day is written as an ISO date', async ({ page, errors }) => {
		await open(page, 'inputs.html');
		const input = page.locator('#date-published');
		await input.evaluate((element) => {
			window.dateEvents = [];
			for (const type of ['input', 'change']) {
				element.addEventListener(type, () => window.dateEvents.push(type));
			}
		});

		await expect(input).toHaveValue('2026-11-07');
		await input.focus();
		const calendar = page.locator('.vc[data-vc="calendar"]').last();
		await expect(calendar).toBeVisible();

		await calendar.locator('[data-vc-date="2026-11-18"] button').click();
		await expect(input).toHaveValue('2026-11-18');
		expect(await page.evaluate(() => window.dateEvents)).toEqual(['input', 'change']);
		expect(errors).toEqual([]);
	});
});

test.describe('forms of the theme', () => {
	test('a click on the adornment focuses its field, the wrapper takes the focus look', async ({ page, errors }) => {
		await open(page, 'forms.html');
		const wrapper = page.locator('.form-adorn', { has: page.locator('[type="search"]') });
		const field = wrapper.locator('.form-ghost');
		const plain = page.locator('input.form-control[placeholder^="Default"]');
		const height = (locator) => locator.evaluate((element) => element.getBoundingClientRect().height);
		const border = (locator) => locator.evaluate((element) => getComputedStyle(element).borderColor);

		// as high as a plain field
		expect(await height(wrapper)).toBe(await height(plain));

		await wrapper.locator('.form-adorn-icon').click({ force: true });
		await expect(field).toBeFocused();
		await page.keyboard.type('abc');
		await expect(field).toHaveValue('abc');

		// the same border as a focused plain field
		await expect.poll(() => border(wrapper)).not.toBe(await border(plain));
		const focused = await border(wrapper);
		await plain.focus();
		await expect.poll(() => border(plain)).toBe(focused);
		expect(errors).toEqual([]);
	});

	test('small checks, radios and switches are 16px', async ({ page }) => {
		await open(page, 'forms.html');
		const sizes = await page.locator('.form-check-sm .form-check-input').evaluateAll((inputs) => inputs.map((input) => {
			const box = input.getBoundingClientRect();
			return `${input.getAttribute('role') || input.type} ${box.width}x${box.height}`;
		}));
		expect(sizes).toEqual(['checkbox 16x16', 'checkbox 16x16', 'radio 16x16', 'radio 16x16', 'switch 28x16', 'switch 28x16']);
	});
});

test.describe('datepicker in a dialog', () => {
	test('the calendar works over an offcanvas, which keeps the focus inside', async ({ page, errors }) => {
		await open(page, 'datagrid.html');
		await page.locator('[data-bs-target="#demo-offcanvas"]').click();
		const input = page.locator('#demo-article-date');
		await expect(page.locator('#demo-offcanvas')).toHaveClass(/show/);

		await input.click();
		const calendar = page.locator('.vc[data-vc="calendar"]').last();
		await expect(calendar).not.toHaveAttribute('data-vc-calendar-hidden');

		const month = calendar.locator('[data-vc="month"]').first();
		const before = await month.textContent();
		await calendar.locator('[data-vc-arrow="next"]').click();
		await expect(month).not.toHaveText(before);

		await calendar.locator('[data-vc-date-btn]').nth(10).click();
		await expect(input).toHaveValue(/^\d{4}-\d{2}-\d{2}$/);
		await expect(page.locator('#demo-offcanvas')).toHaveClass(/show/);
		expect(errors).toEqual([]);
	});
});

test.describe('charts', () => {
	test('every chart is drawn and has a table of its values', async ({ page, errors }) => {
		await open(page, 'index.html');
		const charts = page.locator('canvas[data-chart]');
		const total = await charts.count();
		expect(total).toBeGreaterThan(0);

		for (let i = 0; i < total; i++) {
			const canvas = charts.nth(i);
			await expect(canvas.locator('xpath=..').locator('table.visually-hidden')).toHaveCount(1);
			// something is painted on the canvas
			expect(await canvas.evaluate((element) => {
				const { data } = element.getContext('2d').getImageData(0, 0, element.width, element.height);
				return data.some((value) => value !== 0);
			}), `chart ${i + 1}`).toBe(true);
		}

		// the charts are drawn again in the colors of the other theme
		await page.locator('.navbar-user').click();
		await page.locator('[data-theme-value="dark"]').click();
		await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
		expect(errors).toEqual([]);
	});
});

test.describe('spinner', () => {
	test('the line runs at the top and leaves the page in use', async ({ page, errors }) => {
		await open(page, 'states.html');
		const button = page.locator('[data-demo-spinner="line"]');

		// two requests at once show one spinner
		await button.click();
		await button.click();
		await expect(page.locator('body > .spinner')).toHaveCount(1);
		// the text for a screen reader comes into the shown status
		await expect(page.locator('body > .spinner[role="status"] .spinner-label')).toHaveText('Loading');
		await expect(page.locator('body > .spinner')).toHaveCount(0, { timeout: 5000 });
		expect(errors).toEqual([]);
	});

	test('the overlay covers the page until the request ends', async ({ page, errors }) => {
		await open(page, 'states.html');
		const button = page.locator('[data-demo-spinner="overlay"]');
		const overlay = page.locator('body > .spinner-overlay');

		await button.click();
		await expect(overlay).toBeVisible();
		// whatever is clicked, the overlay takes it, and the keyboard does not reach the button
		expect(await button.evaluate((element) => {
			const { x, y, width, height } = element.getBoundingClientRect();
			return document.elementFromPoint(x + width / 2, y + height / 2).className;
		})).toBe('spinner-overlay');
		await page.keyboard.press('Enter');
		await expect(overlay).toHaveCount(0, { timeout: 5000 });
		await expect(button).toBeFocused();
		expect(errors).toEqual([]);
	});
});
