/**
 * OtpInput: a one-time code typed into separate slots, with the markup, options, methods and events of the OTP input
 * of Bootstrap 6. One real input holds the value (so a form, a screen reader, a password manager and the autofill of
 * a code from an SMS see a plain field); the script draws a slot for each character under it and keeps the caret on
 * one slot. The number of slots is the maxlength of the input (6 without it).
 *
 * <div class="otp" data-bs-otp>
 *   <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">
 * </div>
 *
 * Options as data attributes of the wrapper: data-bs-length, data-bs-type (numeric, alphanumeric, alpha),
 * data-bs-mask="true", data-bs-groups="[3,3]", data-bs-separator. The wrapper fires input.bs.otpInput after every
 * change and complete.bs.otpInput when all slots are filled (the value is in event.value and event.detail.value).
 * The events of the inputs are caught on the document, so a code loaded later (an AJAX snippet) works without a new
 * init(); update() draws its slots at once.
 */
const MASK_CHARACTER = '•';

// the keyboard of a phone, the pattern of the validation and the characters that are thrown away
const TYPES = {
	numeric: { inputmode: 'numeric', pattern: '[0-9]*', filter: /[^0-9]/g },
	alphanumeric: { inputmode: 'text', pattern: '[A-Za-z0-9]*', filter: /[^A-Za-z0-9]/g },
	alpha: { inputmode: 'text', pattern: '[A-Za-z]*', filter: /[^A-Za-z]/g },
};

export class OtpInput {
	static Default = {
		groups: null,
		length: null,
		mask: false,
		separator: '·',
		type: 'numeric',
	};

	static _instances = new WeakMap();
	static _initialized = false;

	/** Starts the handling of all codes of the page and draws the slots of those in the root. */
	static init(root = document) {
		if (!this._initialized) {
			this._initialized = true;
			const on = (type, method) => document.addEventListener(type, (event) => this._of(event.target)?.[method](event), true);
			on('beforeinput', '_handleBeforeInput');
			on('input', '_handleInput');
			on('paste', '_handlePaste');
			on('pointerdown', '_handlePointerDown');
			on('focus', '_handleFocus');
			on('blur', '_render');
			on('keyup', '_render');
			on('select', '_render');
			document.addEventListener('selectionchange', () => this._of(document.activeElement)?._render());
			// a reset form returns the first value after the event
			document.addEventListener('reset', (event) => setTimeout(() => this.update(event.target)));
		}

		this.update(root);
	}

	/** Draws the slots of the codes in the root (after an AJAX redraw) and redraws the ones that have them. */
	static update(root = document) {
		root.querySelectorAll('[data-bs-otp]').forEach((element) => {
			const instance = this.getOrCreateInstance(element);
			if (instance._input) {
				instance._render();
			}
		});
	}

	static getInstance(element) {
		return this._instances.get(element) ?? null;
	}

	static getOrCreateInstance(element, config = {}) {
		return this.getInstance(element) ?? new this(element, config);
	}

	// the instance of the code an input belongs to, created when the input is touched for the first time
	static _of(target) {
		if (!(target instanceof HTMLInputElement)) {
			return null;
		}

		const element = target.closest('[data-bs-otp]');
		const instance = element ? this.getOrCreateInstance(element) : null;
		return instance?._input === target ? instance : null;
	}

	constructor(element, config = {}) {
		this._element = element;
		this._input = element.querySelector('input');
		if (!this._input) {
			return;
		}

		this._config = { ...OtpInput.Default, ...this._dataConfig(), ...config };
		this._type = TYPES[this._config.type] || TYPES.numeric;
		this._length = this._resolveLength();
		this._slots = [];
		// a focus that came from a click keeps the clicked slot instead of going to the first empty one
		this._pointerActive = false;
		this._pointerIndex = 0;

		OtpInput._instances.set(element, this);
		this._setupInput();
		this._renderSlots();
		this._render();
	}

	getValue() {
		return this._input.value;
	}

	setValue(value) {
		this._input.value = this._sanitize(String(value));
		this._render();
		this._checkComplete();
	}

	clear() {
		this._input.value = '';
		this._render();
		this._input.focus();
	}

	/** Focuses the code at its first empty slot (the last one when it is full). */
	focus() {
		this._input.focus();
		this._selectSlot(this._firstEmptyIndex());
		this._render();
	}

	dispose() {
		this._slotsContainer?.remove();
		this._element.classList.remove('otp-rendered');
		OtpInput._instances.delete(this._element);
	}

	_dataConfig() {
		const { bsLength, bsType, bsMask, bsGroups, bsSeparator } = this._element.dataset;
		const config = {};
		if (bsLength) {
			config.length = Number.parseInt(bsLength, 10) || null;
		}
		if (bsType) {
			config.type = bsType;
		}
		if (bsMask !== undefined) {
			config.mask = bsMask === 'true' || bsMask === '';
		}
		if (bsSeparator !== undefined) {
			config.separator = bsSeparator;
		}
		if (bsGroups) {
			try {
				config.groups = JSON.parse(bsGroups);
			} catch {
				config.groups = null;
			}
		}

		return config;
	}

	_resolveLength() {
		if (this._config.length) {
			return this._config.length;
		}

		const maxLength = Number.parseInt(this._input.getAttribute('maxlength'), 10);
		return Number.isNaN(maxLength) || maxLength < 1 ? 6 : maxLength;
	}

	_setupInput() {
		const input = this._input;
		if (input.type === 'number' || input.type === 'password') {
			input.type = 'text';
		}

		input.classList.add('otp-input');
		input.setAttribute('maxlength', String(this._length));
		input.setAttribute('inputmode', this._type.inputmode);
		input.setAttribute('pattern', this._type.pattern);
		if (!input.getAttribute('autocomplete')) {
			input.setAttribute('autocomplete', 'one-time-code');
		}

		if (input.value) {
			input.value = this._sanitize(input.value);
		}
	}

	_renderSlots() {
		const container = document.createElement('div');
		container.className = 'otp-slots';
		container.setAttribute('aria-hidden', 'true');

		const { groups } = this._config;
		let groupIndex = 0;
		let inGroup = 0;

		for (let i = 0; i < this._length; i++) {
			const slot = document.createElement('div');
			slot.className = 'otp-slot';
			container.append(slot);
			this._slots.push(slot);

			// a separator between the groups; the last size repeats for the rest of the slots
			if (Array.isArray(groups) && groups.length > 0) {
				inGroup++;
				if (inGroup === groups[groupIndex] && i < this._length - 1) {
					const separator = document.createElement('div');
					separator.className = 'otp-separator';
					separator.textContent = this._config.separator;
					container.append(separator);
					groupIndex = Math.min(groupIndex + 1, groups.length - 1);
					inGroup = 0;
				}
			}
		}

		this._slotsContainer = container;
		this._element.append(container);
		this._element.classList.add('otp-rendered');
	}

	_handleFocus() {
		if (this._pointerActive) {
			// the click focused the input itself (so a phone shows its keyboard); now the caret goes to the clicked slot
			this._pointerActive = false;
			this._selectSlot(this._pointerIndex);
		} else {
			this._selectSlot(this._firstEmptyIndex());
		}

		this._render();
	}

	// more characters at once (the autofill of a code from an SMS, a composition); single keys go by _handleBeforeInput
	_handleInput() {
		const sanitized = this._sanitize(this._input.value);
		if (sanitized !== this._input.value) {
			this._input.value = sanitized;
		}

		if (document.activeElement === this._input) {
			this._selectSlot(this._firstEmptyIndex());
		}

		this._afterValueChange();
	}

	_handlePaste(event) {
		const pasted = event.clipboardData?.getData('text');
		if (!pasted || !this._isEditable()) {
			return;
		}

		// cleaned before the length is cut: the browser would cut "123 456" to its maxlength with the space inside
		const sanitized = this._sanitize(pasted);
		let start = this._input.selectionStart ?? this._input.value.length;
		let end = this._input.selectionEnd ?? start;
		if (sanitized.length === this._length) {
			start = 0;
			end = this._input.value.length;
		}

		const inserted = sanitized.slice(0, this._length - this._input.value.length + end - start);
		event.preventDefault();
		if (!inserted) {
			return;
		}

		this._input.setRangeText(inserted, start, end, 'end');
		this._selectSlot(this._input.selectionStart);
		this._afterValueChange();
	}

	// a typed character replaces the one of its slot (it does not push the others), backspace and delete remove one
	_handleBeforeInput(event) {
		if (!this._isEditable()) {
			return;
		}

		const { inputType, data } = event;
		if (inputType === 'insertText' && data && data.length === 1) {
			event.preventDefault();
			const char = this._sanitize(data);
			if (!char) {
				return;
			}

			const index = Math.min(this._input.selectionStart ?? 0, this._length - 1);
			const chars = [...this._input.value];
			chars[index] = char;
			this._input.value = chars.join('').slice(0, this._length);
			this._selectSlot(index + 1);
			this._afterValueChange();
			return;
		}

		if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
			event.preventDefault();

			// a chosen slot is cleared; with a plain caret backspace takes the character before it, delete the one after
			let start = this._input.selectionStart ?? 0;
			let end = this._input.selectionEnd ?? start;
			if (end === start) {
				if (inputType === 'deleteContentBackward') {
					start -= 1;
				} else {
					end += 1;
				}
			}

			const chars = [...this._input.value];
			if (start < 0 || end > chars.length) {
				return;
			}

			chars.splice(start, end - start);
			this._input.value = chars.join('');
			this._selectSlot(start);
			this._afterValueChange();
		}
	}

	_handlePointerDown(event) {
		if (this._input.matches(':disabled')) {
			return;
		}

		// never past the first empty slot
		const target = Math.min(this._slotIndexFromPoint(event.clientX), this._firstEmptyIndex());
		if (document.activeElement === this._input) {
			event.preventDefault();
			this._selectSlot(target);
			this._render();
			return;
		}

		// not focused yet: the browser focuses the input by the click itself, the caret is set in _handleFocus
		this._pointerActive = true;
		this._pointerIndex = target;
	}

	_slotIndexFromPoint(x) {
		const index = this._slots.findIndex((slot) => x <= slot.getBoundingClientRect().right);
		return index === -1 ? this._slots.length - 1 : index;
	}

	_afterValueChange() {
		this._render();
		this._trigger('input.bs.otpInput');
		this._checkComplete();
	}

	_checkComplete() {
		if (this._input.value.length === this._length) {
			this._trigger('complete.bs.otpInput');
		}
	}

	_trigger(type) {
		const value = this._input.value;
		const event = new CustomEvent(type, { bubbles: true, detail: { value } });
		event.value = value;
		this._element.dispatchEvent(event);
	}

	_firstEmptyIndex() {
		return Math.min(this._input.value.length, this._length - 1);
	}

	_isEditable() {
		return !this._input.readOnly && !this._input.matches(':disabled');
	}

	// the current slot is a selection: a filled one is selected (the next key replaces it), an empty one has the caret
	_selectSlot(index) {
		const clamped = Math.max(0, Math.min(index, this._length - 1));
		const end = clamped < this._input.value.length ? clamped + 1 : clamped;
		this._input.setSelectionRange(clamped, end);
	}

	_sanitize(value) {
		return value.replace(this._type.filter, '').slice(0, this._length);
	}

	_render() {
		const { value } = this._input;
		const isFocused = document.activeElement === this._input;
		const caret = Math.min(this._input.selectionStart ?? value.length, this._length - 1);

		this._slots.forEach((slot, index) => {
			const char = value[index] ?? '';
			slot.textContent = char && this._config.mask ? MASK_CHARACTER : char;
			slot.classList.toggle('otp-slot-filled', Boolean(char));
			slot.classList.toggle('otp-slot-active', isFocused && index === caret);
		});
	}
}
