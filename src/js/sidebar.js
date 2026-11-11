/*!
	** Sidebar for Bootstrap
	** Copyright Zdeněk Papučík
	** MIT License
	**/
export class Sidebar {
	// the key of the remembered compact sidebar in localStorage
	static compactStorageKey = 'sidebar-compact';
	static _compactInitialized = false;
	// the name of a hovered link and the menu of a group next to the compact sidebar (one of each, made on first use)
	static _label = null;
	static _flyout = null;
	static _flyoutGroup = null;

	static init() {
		this._initCompact();

		const sidebar = document.getElementById('sidebar');
		const navigation = document.getElementById('navigation');

		if (!sidebar || !navigation || navigation.dataset.sidebarInitialized === 'true') {
			return;
		}

		navigation.dataset.sidebarInitialized = 'true';
		sidebar.setAttribute('aria-controls', navigation.id);

		const backdrop = document.createElement('div');
		backdrop.className = 'sidebar-backdrop';
		navigation.after(backdrop);

		const setExpanded = (expanded) => {
			sidebar.setAttribute('aria-expanded', String(expanded));
		};

		const isOpen = () => navigation.classList.contains('sidebar-toggle');
		setExpanded(isOpen());
		backdrop.classList.toggle('show', isOpen());

		const close = () => {
			navigation.classList.remove('sidebar-toggle');
			backdrop.classList.remove('show');
			setExpanded(false);
		};
		const media = window.matchMedia('(min-width: 768px)');

		sidebar.addEventListener('click', () => {
			const expanded = !isOpen();
			navigation.classList.toggle('sidebar-toggle', expanded);
			backdrop.classList.toggle('show', expanded);
			setExpanded(expanded);
		});

		backdrop.addEventListener('click', () => {
			close();
			sidebar.focus();
		});
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && isOpen()) {
				close();
				sidebar.focus();
			}
		});
		media.addEventListener('change', (event) => {
			if (event.matches) {
				close();
			}
		});
	}

	/**
	 * The compact sidebar with the icons only (from md up): a button [data-sidebar-compact] switches the class
	 * sidebar-compact of <html> and remembers it; the head of a page can set the class before it is drawn:
	 * <script>try { if (localStorage.getItem('sidebar-compact') === '1') document.documentElement.classList.add('sidebar-compact'); } catch (e) { }</script>
	 */
	static setCompact(compact) {
		document.documentElement.classList.toggle('sidebar-compact', compact);
		document.querySelectorAll('[data-sidebar-compact]').forEach((button) => button.setAttribute('aria-pressed', String(compact)));
		try {
			localStorage.setItem(this.compactStorageKey, compact ? '1' : '0');
		} catch (e) { }
		this._label?.setAttribute('hidden', '');
		this._closeFlyout();
		// a scrollbar of the menu (Perfect scrollbar) measures its box again on a resize
		window.dispatchEvent(new Event('resize'));
	}

	static isCompact() {
		return document.documentElement.classList.contains('sidebar-compact') && window.matchMedia('(min-width: 768px)').matches;
	}

	static _initCompact() {
		if (this._compactInitialized) {
			return;
		}

		this._compactInitialized = true;

		let stored = null;
		try {
			stored = localStorage.getItem(this.compactStorageKey);
		} catch (e) { }
		const compact = stored === null ? document.documentElement.classList.contains('sidebar-compact') : stored === '1';
		document.documentElement.classList.toggle('sidebar-compact', compact);
		document.querySelectorAll('[data-sidebar-compact]').forEach((button) => button.setAttribute('aria-pressed', String(compact)));

		document.addEventListener('click', (event) => {
			if (event.target.closest('[data-sidebar-compact]')) {
				this.setCompact(!document.documentElement.classList.contains('sidebar-compact'));
				return;
			}

			// a link with a submenu opens its links in a menu next to the icon (the sidebar stays narrow); the menu of the
			// sidebar does not get the click, so its submenu keeps its state for the wide sidebar
			const group = event.target.closest('.sidebar .list-link.link-arrow');
			if (group && this.isCompact()) {
				event.preventDefault();
				event.stopImmediatePropagation();
				if (this._flyoutGroup === group) {
					this._closeFlyout();
				} else {
					// a click of the mouse leaves the focus on the icon, Enter or Space moves it into the menu
					this._openFlyout(group, event.detail === 0);
				}
				return;
			}

			if (this._flyout && !event.target.closest('.sidebar-compact-menu')) {
				this._closeFlyout();
			}
		}, true);

		// the keys of a dropdown: Esc closes the menu (the focus back on its icon), the arrows move between its links.
		// The menu has the class of a dropdown of Bootstrap for its look, so its keys must not reach the handler of
		// Bootstrap (on the document in the capture phase): it would open the first dropdown of the page, as the menu
		// has no toggle of its own. So they are handled on the window, before the document, and stopped there
		window.addEventListener('keydown', (event) => {
			if (!this._flyout || !['Escape', 'ArrowDown', 'ArrowUp', 'Tab'].includes(event.key)) {
				return;
			}

			// the menu stands at the end of the page, so Tab leaves it as if it stood after its icon: Tab after the last
			// link goes on from the icon to the next one, Shift+Tab before the first link returns to the icon
			if (event.key === 'Tab') {
				const items = [...this._flyout.querySelectorAll('.dropdown-item')];
				if (event.shiftKey && event.target === items[0]) {
					event.preventDefault();
					this._closeFlyout(true);
				} else if (!event.shiftKey && event.target === items[items.length - 1]) {
					this._closeFlyout(true);
				}
				return;
			}

			if (event.key === 'Escape') {
				this._closeFlyout(true);
			} else if (this._flyout.contains(event.target)) {
				const items = [...this._flyout.querySelectorAll('.dropdown-item')];
				const index = items.indexOf(document.activeElement);
				const next = event.key === 'ArrowDown' ? Math.min(index + 1, items.length - 1) : Math.max(index - 1, 0);
				event.preventDefault();
				items[index === -1 ? 0 : next]?.focus();
			} else {
				return;
			}
			event.stopPropagation();
		}, true);
		// the focus moving anywhere else (a click into a field, a dialog taking the focus) closes the menu
		document.addEventListener('focusin', (event) => {
			if (this._flyout && !this._flyout.contains(event.target) && event.target !== this._flyoutGroup) {
				this._closeFlyout();
			}
		});
		window.addEventListener('resize', () => this._closeFlyout());

		// the name of a hovered or focused link next to the compact sidebar
		const show = (event) => {
			const link = event.target.closest?.('.sidebar .list-link');
			if (!link || !this.isCompact() || link === this._flyoutGroup) {
				return;
			}

			if (!this._label) {
				this._label = document.createElement('div');
				this._label.className = 'sidebar-compact-label';
				this._label.setAttribute('aria-hidden', 'true');
				document.body.append(this._label);
			}

			const rect = link.getBoundingClientRect();
			this._label.textContent = this._linkText(link);
			this._label.style.left = `${rect.right + 8}px`;
			this._label.style.top = `${rect.top + rect.height / 2}px`;
			this._label.removeAttribute('hidden');
		};
		const hide = (event) => {
			if (event.target.closest?.('.sidebar .list-link')) {
				this._label?.setAttribute('hidden', '');
			}
		};
		document.addEventListener('mouseover', show);
		document.addEventListener('focusin', show);
		document.addEventListener('mouseout', hide);
		document.addEventListener('focusout', hide);
		document.addEventListener('scroll', (event) => {
			this._label?.setAttribute('hidden', '');
			if (!event.target.closest?.('.sidebar-compact-menu')) {
				this._closeFlyout();
			}
		}, true);
	}

	// the text of a link of the menu without its icon and badge
	static _linkText(link) {
		return (link.querySelector('.float-start') || link).textContent.trim();
	}

	/** The links of a group in a menu of the theme (.dropdown-menu) next to its icon in the compact sidebar. */
	static _openFlyout(group, focus = false) {
		this._closeFlyout();

		const submenu = group.nextElementSibling;
		if (!submenu) {
			return;
		}

		const menu = document.createElement('ul');
		menu.className = 'dropdown-menu show sidebar-compact-menu';
		menu.id = 'sidebar-compact-menu';

		const header = document.createElement('li');
		header.innerHTML = '<h6 class="dropdown-header"></h6>';
		header.firstChild.textContent = this._linkText(group);
		menu.append(header);

		// deeper levels follow under the name of their group, indented
		submenu.querySelectorAll('.list-link').forEach((link) => {
			const depth = this._depth(link, submenu);
			const item = document.createElement('li');
			if (link.classList.contains('link-arrow')) {
				item.innerHTML = '<h6 class="dropdown-header"></h6>';
			} else {
				item.innerHTML = '<a class="dropdown-item"></a>';
				const anchor = item.firstChild;
				anchor.href = link.getAttribute('href') || '#';
				if (link.classList.contains('link-current')) {
					anchor.classList.add('active');
					anchor.setAttribute('aria-current', 'page');
				}
			}
			item.firstChild.textContent = this._linkText(link);
			item.firstChild.style.paddingLeft = depth ? `calc(var(--bs-dropdown-item-padding-x) + ${depth}rem)` : '';
			menu.append(item);
		});

		document.body.append(menu);

		// next to the icon, its top in line with the icon, inside the window
		const rect = group.getBoundingClientRect();
		const top = Math.max(8, Math.min(rect.top - 8, window.innerHeight - menu.offsetHeight - 8));
		menu.style.left = `${rect.right + 8}px`;
		menu.style.top = `${top}px`;

		this._flyout = menu;
		this._flyoutGroup = group;
		group.setAttribute('aria-controls', menu.id);
		group.setAttribute('aria-expanded', 'true');
		group.classList.add('sidebar-compact-open');
		this._label?.setAttribute('hidden', '');
		if (focus) {
			menu.querySelector('.dropdown-item')?.focus({ preventScroll: true });
		}
	}

	/** Closes the menu of a group; `focusGroup` moves the focus back on its icon (Esc). */
	static _closeFlyout(focusGroup = false) {
		if (!this._flyout) {
			return;
		}

		if (focusGroup) {
			this._flyoutGroup.focus();
		}

		const group = this._flyoutGroup;
		const submenu = group.nextElementSibling;
		group.classList.remove('sidebar-compact-open');
		if (submenu) {
			if (submenu.id) {
				group.setAttribute('aria-controls', submenu.id);
			} else {
				group.removeAttribute('aria-controls');
			}
			// the state of the submenu in the wide sidebar (the compact one hides it by CSS, so only its own style counts)
			group.setAttribute('aria-expanded', String(submenu.style.display === 'block'));
		}
		this._flyout.remove();
		this._flyout = null;
		this._flyoutGroup = null;
	}

	// how many submenus a link is nested in below the submenu of its group
	static _depth(link, submenu) {
		let depth = 0;
		for (let element = link.parentElement; element && element !== submenu; element = element.parentElement) {
			if (element.classList.contains('list-hidden')) {
				depth++;
			}
		}
		return depth;
	}
}
