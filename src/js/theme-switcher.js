/**
 * Theme switcher: the light or dark theme of Bootstrap, or "auto" (the setting of the system, followed when it
 * changes), remembered in localStorage. A toggle button ([data-theme-switcher]) switches light ↔ dark; choice buttons
 * ([data-theme-value="light|dark|auto"], e.g. a segmented control in the user menu) set a mode and are marked active.
 * It fires "theme-switcher:change" on window with the theme and the mode.
 */
const switcherClickHandlers = new WeakMap();
const modes = ['light', 'dark', 'auto'];

export class ThemeSwitcher {
	constructor(options = {}) {
		this.options = {
			selector: '[data-theme-switcher]',
			choiceSelector: '[data-theme-value]',
			storageKey: 'bootstrap-theme',
			defaultTheme: 'light',
			lightIcon: '',
			darkIcon: '',
			lightLabel: 'Light mode',
			darkLabel: 'Dark mode',
			...options,
		};
	}

	initialize(root = document) {
		this.root = root;
		this.documentElement = document.documentElement;
		this.switchers = [...root.querySelectorAll(this.options.selector)];
		this.choices = [...root.querySelectorAll(this.options.choiceSelector)];
		this.media = window.matchMedia('(prefers-color-scheme: dark)');

		this.setTheme(this.getInitialTheme(), false);

		const listen = (element, handler) => {
			const previousHandler = switcherClickHandlers.get(element);
			if (previousHandler) {
				element.removeEventListener('click', previousHandler);
			}
			element.addEventListener('click', handler);
			switcherClickHandlers.set(element, handler);
		};
		for (const switcher of this.switchers) {
			listen(switcher, () => this.setTheme(this.getNextTheme()));
		}
		for (const choice of this.choices) {
			listen(choice, () => this.setTheme(choice.dataset.themeValue));
		}

		// in the auto mode the page follows the system when it switches between light and dark
		if (!this.mediaHandler) {
			this.mediaHandler = () => {
				if (this.mode === 'auto') this.setTheme('auto', false);
			};
			this.media.addEventListener('change', this.mediaHandler);
		}

		return this;
	}

	getInitialTheme() {
		let storedTheme;
		try {
			storedTheme = localStorage.getItem(this.options.storageKey);
		} catch {
			// Storage can be unavailable in restricted browser contexts.
		}

		if (modes.includes(storedTheme)) {
			return storedTheme;
		}

		const currentTheme = this.documentElement.getAttribute('data-bs-theme');

		if (currentTheme === 'light' || currentTheme === 'dark') {
			return currentTheme;
		}

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}

		return this.options.defaultTheme;
	}

	getCurrentTheme() {
		return this.documentElement.getAttribute('data-bs-theme') === 'dark'
			? 'dark'
			: 'light';
	}

	getNextTheme() {
		return this.getCurrentTheme() === 'dark' ? 'light' : 'dark';
	}

	/** Sets "light", "dark" or "auto" (the theme of the system). */
	setTheme(mode, persist = true) {
		this.mode = modes.includes(mode) ? mode : this.options.defaultTheme;
		const theme = this.mode === 'auto' ? (this.media.matches ? 'dark' : 'light') : this.mode;
		this.documentElement.setAttribute('data-bs-theme', theme);

		if (persist) {
			try {
				localStorage.setItem(this.options.storageKey, this.mode);
			} catch {
				// Keep the in-page theme change even when persistence is unavailable.
			}
		}

		this.updateSwitchers(theme);
		this.updateChoices();
		this.dispatchChange(theme);
	}

	updateChoices() {
		for (const choice of this.choices) {
			const active = choice.dataset.themeValue === this.mode;
			choice.classList.toggle('active', active);
			choice.setAttribute('aria-pressed', String(active));
		}
	}

	updateSwitchers(theme) {
		const targetTheme = theme === 'dark' ? 'light' : 'dark';

		for (const switcher of this.switchers) {
			switcher.setAttribute('aria-pressed', String(theme === 'dark'));
			switcher.dataset.theme = theme;

			this.updateIcon(switcher, targetTheme);
			this.updateLabel(switcher, targetTheme);
		}
	}

	updateIcon(switcher, targetTheme) {
		const icon = switcher.querySelector('[data-theme-switcher-icon]');

		if (!icon) {
			return;
		}

		const iconClass = targetTheme === 'light'
			? this.getOption(switcher, 'lightIcon')
			: this.getOption(switcher, 'darkIcon');

		if (iconClass) {
			icon.className = iconClass;
		}
	}

	updateLabel(switcher, targetTheme) {
		const label = switcher.querySelector('[data-theme-switcher-label]');

		if (!label) {
			return;
		}

		label.textContent = targetTheme === 'light'
			? this.getOption(switcher, 'lightLabel')
			: this.getOption(switcher, 'darkLabel');
	}

	getOption(switcher, name) {
		const themeName = `theme${name.charAt(0).toUpperCase()}${name.slice(1)}`;

		return switcher.dataset[themeName]
			|| switcher.dataset[name]
			|| this.options[name];
	}

	dispatchChange(theme) {
		window.dispatchEvent(new CustomEvent('theme-switcher:change', {
			detail: { theme, mode: this.mode },
		}));
	}
}
