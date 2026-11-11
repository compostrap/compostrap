/**
 * RowSelection: rows of a table chosen by checkboxes and a bar with the actions for them (the bulk actions of
 * a datagrid). Inside a [data-selection] wrapper the checkbox [data-selection-all] checks all [data-selection-item]
 * checkboxes (and shows a dash when only some are checked), a chosen row gets the class table-active, the bar
 * [data-selection-bar] is shown while a row is chosen, [data-selection-count] holds their number and
 * [data-selection-clear] unchecks them. The checkboxes are found on every change, so a table drawn again
 * (an AJAX snippet) needs no new init(); call RowSelection.update(wrapper) after such a redraw to bring the bar
 * in line with the new rows.
 *
 * <div data-selection>
 *   <table>
 *     <thead><tr><th><input type="checkbox" data-selection-all></th>…</tr></thead>
 *     <tbody><tr><td><input type="checkbox" data-selection-item name="ids[]" value="1"></td>…</tr></tbody>
 *   </table>
 *   <div class="selection-bar" data-selection-bar hidden>
 *     <strong data-selection-count>0</strong> selected … <button type="button" data-selection-clear></button>
 *   </div>
 * </div>
 */
export class RowSelection {
	static _initialized = false;

	static init() {
		if (this._initialized) {
			return;
		}

		this._initialized = true;

		document.addEventListener('change', (event) => {
			const input = event.target.closest?.('[data-selection-all], [data-selection-item]');
			const wrapper = input?.closest('[data-selection]');
			if (!wrapper) {
				return;
			}

			if (input.matches('[data-selection-all]')) {
				this.items(wrapper).forEach((item) => item.checked = input.checked);
			}

			this.update(wrapper);
		});

		document.addEventListener('click', (event) => {
			const wrapper = event.target.closest('[data-selection-clear]')?.closest('[data-selection]');
			if (wrapper) {
				this.clear(wrapper);
			}
		});

		// checkboxes kept checked by the browser after a reload
		document.querySelectorAll('[data-selection]').forEach((wrapper) => this.update(wrapper));
	}

	/** The checkboxes of the rows that can be chosen. */
	static items(wrapper) {
		return [...wrapper.querySelectorAll('[data-selection-item]:not(:disabled)')];
	}

	/** Unchecks all rows. */
	static clear(wrapper) {
		this.items(wrapper).forEach((item) => item.checked = false);
		this.update(wrapper);
	}

	/** Brings the "select all" checkbox, the rows, the count and the bar in line with the checked rows. */
	static update(wrapper) {
		const items = this.items(wrapper);
		const count = items.filter((item) => item.checked).length;

		items.forEach((item) => item.closest('tr')?.classList.toggle('table-active', item.checked));

		wrapper.querySelectorAll('[data-selection-all]').forEach((all) => {
			all.checked = count > 0 && count === items.length;
			all.indeterminate = count > 0 && count < items.length;
		});
		wrapper.querySelectorAll('[data-selection-count]').forEach((element) => element.textContent = String(count));
		wrapper.querySelectorAll('[data-selection-bar]').forEach((bar) => bar.hidden = count === 0);
	}
}
