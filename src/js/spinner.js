/**
 * Spinner: shows that a request runs. show() puts the spinner at the end of <body>, hide() removes it; the calls are
 * counted, so with more requests at once the spinner stays until the last one ends.
 *
 * const spinner = new Spinner();                  // a line at the top of the window (.spinner), the page stays in use
 * const spinner = new Spinner({ overlay: true }); // the window darkens (.spinner-overlay), nothing can be clicked
 *
 * spinner.show();
 * fetch(url).finally(() => spinner.hide());
 *
 * The overlay also stops the keyboard (Tab, Enter, Space), so a focused button cannot send the form once more, and
 * gives the focus back when it ends.
 */
export class Spinner {
	_count = 0;
	_focused = null;

	constructor({ overlay = false, label = 'Loading', parent = document.body } = {}) {
		this.overlay = overlay;
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.className = overlay ? 'spinner-overlay' : 'spinner';
		this.element.setAttribute('role', 'status');
		this.element.setAttribute('aria-label', label);
	}

	/** Whether a request runs. */
	get active() {
		return this._count > 0;
	}

	show() {
		if (this._count++ > 0) {
			return;
		}

		this.parent.appendChild(this.element);
		if (this.overlay) {
			this._focused = document.activeElement;
			this._focused?.blur?.();
			document.addEventListener('keydown', this._stopKeys, true);
		}
	}

	hide() {
		if (this._count === 0 || --this._count > 0) {
			return;
		}

		this.element.remove();
		if (this.overlay) {
			document.removeEventListener('keydown', this._stopKeys, true);
			if (this._focused?.isConnected) {
				this._focused.focus({ preventScroll: true });
			}
			this._focused = null;
		}
	}

	_stopKeys = (event) => {
		if (['Tab', 'Enter', ' '].includes(event.key)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};
}
