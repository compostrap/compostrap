/**
 * Number input: the minus and plus buttons (data-number-input="down" / "up") of a .number-input step its input by its
 * step, keep the decimals of a fractional step (step="0.25" → 1.50) and stop at min and max, whose buttons are
 * disabled. A step fires input and change on the input, so a form can react (e.g. recount a cart by AJAX). The keys
 * ↑ ↓ step a text input too. The buttons are found on every click, so inputs loaded later need no new init().
 *
 * <div class="number-input">
 *   <button type="button" class="number-input-btn" data-number-input="down" aria-label="Decrease"></button>
 *   <input type="number" class="form-control" value="1" min="1" max="99">
 *   <button type="button" class="number-input-btn" data-number-input="up" aria-label="Increase"></button>
 * </div>
 */
export class NumberInput {
	static _initialized = false;

	static init() {
		document.querySelectorAll('.number-input > input').forEach((input) => this.update(input));
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		document.addEventListener('click', (event) => {
			const button = event.target.closest('[data-number-input]');
			const input = button?.closest('.number-input')?.querySelector('input');
			if (input && !input.disabled && !input.readOnly) {
				this.step(input, button.dataset.numberInput === 'down' ? -1 : 1);
			}
		});
		document.addEventListener('keydown', (event) => {
			const input = event.target;
			if (input instanceof HTMLInputElement && input.type !== 'number' && input.closest('.number-input')
				&& (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
				event.preventDefault();
				this.step(input, event.key === 'ArrowDown' ? -1 : 1);
			}
		});
		document.addEventListener('input', (event) => {
			if (event.target instanceof HTMLInputElement && event.target.closest('.number-input')) {
				this.update(event.target);
			}
		});
	}

	/** Steps the input up (1) or down (-1) and fires input and change. */
	static step(input, direction) {
		const { step, decimals, min, max } = this._limits(input);
		const current = this._value(input);
		let next = Number.isNaN(current) ? (min ?? 0) : current + direction * step;
		if (min !== null) next = Math.max(min, next);
		if (max !== null) next = Math.min(max, next);

		input.value = next.toFixed(decimals);
		this.update(input);
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.dispatchEvent(new Event('change', { bubbles: true }));
	}

	/** Disables the button that would step past min or max. */
	static update(input) {
		const box = input.closest('.number-input');
		if (!box) return;
		const { min, max } = this._limits(input);
		const value = this._value(input);
		box.querySelectorAll('[data-number-input]').forEach((button) => {
			const down = button.dataset.numberInput === 'down';
			const limit = down ? min : max;
			button.disabled = input.disabled || input.readOnly
				|| (limit !== null && !Number.isNaN(value) && (down ? value <= limit : value >= limit));
		});
	}

	static _value(input) {
		return parseFloat(String(input.value).replace(',', '.'));
	}

	static _limits(input) {
		const attr = (name) => {
			const value = parseFloat(input.getAttribute(name));
			return Number.isNaN(value) ? null : value;
		};
		const stepAttr = input.getAttribute('step');
		const step = attr('step') || 1;
		const decimals = stepAttr && stepAttr.includes('.') ? stepAttr.split('.')[1].length : 0;
		return { step, decimals, min: attr('min'), max: attr('max') };
	}
}
