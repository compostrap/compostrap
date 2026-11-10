/**
 * PasswordToggle: a button in a password input shows the typed password and hides it again (the password toggle of
 * drago-ex/form, without Naja). The button switches the type of the input of its .password-toggle wrapper between
 * password and text and keeps aria-pressed in line; the icon is drawn by CSS from the type. The buttons are found
 * on every click, so forms loaded later (AJAX snippets) need no new init().
 *
 * <div class="password-toggle">
 *   <input type="password" class="form-control">
 *   <button type="button" class="password-toggle-btn" data-password-toggle aria-label="Show password" aria-pressed="false"></button>
 * </div>
 */
export class PasswordToggle {
	static _initialized = false;

	static init() {
		if (this._initialized) {
			return;
		}

		this._initialized = true;

		// the buttons are hidden until the script runs (a page without JavaScript has no dead button)
		document.documentElement.setAttribute('data-password-toggle', '');

		document.addEventListener('click', (event) => {
			const button = event.target.closest('[data-password-toggle]');
			const input = button?.closest('.password-toggle')?.querySelector('input');
			if (input) {
				this.toggle(input);
			}
		});

		// a shown password is sent as a password again: a text input could be kept by the browser among its
		// suggestions, and a form drawn again (a validation error) starts hidden
		document.addEventListener('submit', (event) => {
			event.target.querySelectorAll('.password-toggle > input[type="text"]').forEach((input) => this.toggle(input, false));
		}, true);
	}

	/** Shows or hides the password of the input; without `show` it switches. */
	static toggle(input, show = input.type === 'password') {
		input.type = show ? 'text' : 'password';
		input.closest('.password-toggle')?.querySelector('[data-password-toggle]')?.setAttribute('aria-pressed', String(show));
	}
}
