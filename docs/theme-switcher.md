# Theme switcher

[← Compostrap](../readme.md#documentation)

The theme is light, dark or `auto`: the setting of the system, followed when the system switches. The choice is remembered in `localStorage`; until a user chooses, the page follows the system (`defaultTheme: 'auto'`; a project that wants one theme for new visitors sets `'light'` or `'dark'`, also in the script of the head). A choice made in another tab of the browser is taken over. The administration puts it in the user menu as a segmented control: choice buttons with `data-theme-value`, the chosen one gets `active` and `aria-pressed`. `data-bs-auto-close="outside"` on the toggle of the menu keeps it open after a click on a choice; `dropdown-theme` (module `dashboard`) lays the row out.

```html
<li class="dropdown-theme">
	<span class="dropdown-theme-label">Theme</span>
	<div class="btn-group btn-group-segmented" role="group" aria-label="Theme">
		<button type="button" class="btn btn-sm" data-theme-value="light"><i class="bi bi-sun"></i>Light</button>
		<button type="button" class="btn btn-sm" data-theme-value="dark"><i class="bi bi-moon"></i>Dark</button>
		<button type="button" class="btn btn-sm" data-theme-value="auto"><i class="bi bi-display"></i>Auto</button>
	</div>
</li>
```

The auto choice says which theme the system has now: the script sets its `title` (`autoLightTitle`, `autoDarkTitle`, or `data-theme-auto-light-title` and `data-theme-auto-dark-title` on the button) and `data-theme-system="light|dark"`, a hook for an own mark.

A single toggle button (e.g. on a sign-in page) switches light ↔ dark. It shows the opposite of the theme on the screen; when that is the theme of the system, the page goes back to following the system (`auto` is stored) instead of being pinned to it. A label and an icon from any icon library are optional:

```html
<button
	type="button"
	class="btn btn-link nav-link theme-switcher"
	aria-label="Toggle theme"
	data-theme-switcher
	data-theme-light-icon="bi bi-sun"
	data-theme-dark-icon="bi bi-moon"
	data-theme-light-label="Light mode"
	data-theme-dark-label="Dark mode"
>
	<i data-theme-switcher-icon class="bi bi-moon"></i>
	<span data-theme-switcher-label>Dark mode</span>
</button>
```

`data-theme-light-label` is shown when the page is dark and the button switches to light, `data-theme-dark-label` the other way round; the shorter `data-light-label`, `data-dark-label`, `data-light-icon` and `data-dark-icon` work too. Labels are English by default. The same values can be passed to JavaScript:

```javascript
new ThemeSwitcher({
	selector: '[data-theme-switcher]',
	storageKey: 'bootstrap-theme',
	defaultTheme: 'auto',
	lightIcon: '',
	darkIcon: '',
	lightLabel: 'Light mode',
	darkLabel: 'Dark mode',
	autoLightTitle: 'System theme: light',
	autoDarkTitle: 'System theme: dark',
}).initialize();
```

After each change the switcher dispatches `theme-switcher:change` on `window`:

```javascript
window.addEventListener('theme-switcher:change', (event) => {
	console.log(event.detail.theme, event.detail.mode); // "dark", "auto"
});
```
