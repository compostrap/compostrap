/**
 * Strength: rates a password while it is typed and shows the level in a meter, with the markup and scoring of the
 * strength component of Bootstrap 6. A meter (.strength or .strength-bar with data-bs-strength) belongs to the password
 * input it stands next to (in the same parent, or in a parent up to three levels, e.g. around a show-password wrapper);
 * a .strength-text next to the meter gets the name of the level. The inputs are found on every keystroke, so forms
 * loaded later (AJAX snippets) need no new init().
 *
 * <input type="password" class="form-control">
 * <div class="strength" data-bs-strength><div class="strength-segment"></div>…</div>
 * <span class="strength-text"></span>
 */
const levels = ['weak', 'fair', 'good', 'strong'];
const special = /[!@#$%^&*(),.?":{}|<>]/;

export class Strength {
	static options = {
		minLength: 8,
		thresholds: [2, 4, 6],
		messages: { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' },
		scorer: null,
	};

	static _initialized = false;

	/** Starts rating; the options (messages, minLength, thresholds, scorer) are merged into the defaults. */
	static init(options = {}) {
		this.options = {
			...this.options,
			...options,
			messages: { ...this.options.messages, ...options.messages },
		};
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		const update = (event) => {
			if (event.target instanceof HTMLInputElement && event.target.type === 'password') {
				this.evaluate(event.target);
			}
		};
		document.addEventListener('input', update);
		document.addEventListener('change', update);
	}

	/** Rates the input and draws its meter; returns the level, or null for an empty password. */
	static evaluate(input) {
		const meter = this._meterOf(input);
		if (!meter) {
			return null;
		}

		const score = this.score(input.value);
		const level = this._level(score);
		if ((meter.dataset.bsStrength || null) !== level) {
			meter.dataset.bsStrength = level ?? '';
			const index = level ? levels.indexOf(level) : -1;
			meter.querySelectorAll('.strength-segment').forEach((segment, i) => segment.classList.toggle('active', i <= index));

			const text = meter.parentElement.querySelector(':scope > .strength-text');
			if (text) {
				text.textContent = level ? this.options.messages[level] : '';
				text.dataset.bsStrength = level ?? '';
			}

			meter.dispatchEvent(new CustomEvent('strengthChange', { bubbles: true, detail: { strength: level, score } }));
		}

		return level;
	}

	/** The score of a password: one point for each rule it meets, or the result of the own scorer. */
	static score(password) {
		if (!password) {
			return 0;
		}

		if (typeof this.options.scorer === 'function') {
			return this.options.scorer(password);
		}

		const { minLength } = this.options;
		return [
			password.length >= minLength,
			password.length >= minLength + 4,
			/[a-z]/.test(password),
			/[A-Z]/.test(password),
			/\d/.test(password),
			special.test(password),
			new RegExp(`${special.source}.*${special.source}`).test(password),
			password.length >= 16,
		].filter(Boolean).length;
	}

	static _level(score) {
		if (score === 0) {
			return null;
		}

		const [weak, fair, good] = this.options.thresholds;
		return score <= weak ? 'weak' : score <= fair ? 'fair' : score <= good ? 'good' : 'strong';
	}

	static _meterOf(input) {
		let parent = input.parentElement;
		for (let depth = 0; parent && depth < 3; depth++, parent = parent.parentElement) {
			const meter = parent.querySelector(':scope > [data-bs-strength]');
			if (meter) {
				return meter;
			}
		}

		return null;
	}
}
