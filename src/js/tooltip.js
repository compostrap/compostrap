/**
 * CssTooltip: Esc hides the CSS tooltip ([data-tooltip]) that is shown, without moving the mouse or the focus away
 * (WCAG 1.4.13). The tooltip itself needs no script; this only adds the key. The first Esc hides the tooltip and
 * goes no further, so a modal or an offcanvas under it stays open; the next one closes it. The tooltip comes back
 * when the mouse or the focus returns to its element. The key is caught on the document, so content loaded later
 * (AJAX snippets) needs no new init().
 *
 * CssTooltip.init(); // once
 */
// an element whose tooltip is shown now (a button with an open dropdown shows none)
const shown = '[data-tooltip]:is(:hover, :focus-visible):not([aria-expanded="true"], [data-tooltip-hidden])';

export class CssTooltip {
	static _initialized = false;

	static init() {
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		document.addEventListener('keydown', (event) => {
			if (event.key !== 'Escape') {
				return;
			}

			const elements = document.querySelectorAll(shown);
			if (!elements.length) {
				return;
			}

			elements.forEach((element) => element.setAttribute('data-tooltip-hidden', ''));
			// the key hid the tooltip: it does not close the dialog under it as well
			event.preventDefault();
			event.stopPropagation();
		}, true);

		// once neither the mouse nor the focus is on the element, its tooltip may be shown again
		const restore = () => setTimeout(() => {
			document.querySelectorAll('[data-tooltip-hidden]:not(:hover, :focus-visible)')
				.forEach((element) => element.removeAttribute('data-tooltip-hidden'));
		});
		document.addEventListener('mouseout', restore, true);
		document.addEventListener('focusout', restore, true);
	}
}
