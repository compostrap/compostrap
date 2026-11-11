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
		this._hideLabel();
		this._closeFlyout();
		// a scrollbar of the menu (Perfect scrollbar) measures its box again on a resize
		window.dispatchEvent(new Event('resize'));
	}

	/** Whether the compact sidebar is shown (it is only from md up). */
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
		if (stored !== null) {
			document.documentElement.classList.toggle('sidebar-compact', stored === '1');
		}
		const compact = document.documentElement.classList.contains('sidebar-compact');
		document.querySelectorAll('[data-sidebar-compact]').forEach((button) => button.setAttribute('aria-pressed', String(compact)));

		// the button, a link with a submenu (its links in a menu next to the icon; SidebarMenu leaves the click alone in
		// the compact sidebar) and a click outside an open menu
		document.addEventListener('click', (event) => {
			if (event.target.closest('[data-sidebar-compact]')) {
				this.setCompact(!document.documentElement.classList.contains('sidebar-compact'));
				return;
			}

			const group = event.target.closest('.sidebar .list-link.link-arrow');
			if (group && this.isCompact()) {
				event.preventDefault();
				if (this._flyoutGroup === group) {
					this._closeFlyout();
				} else {
					// a click of the mouse leaves the focus on the icon, Enter or Space moves it into the menu
					this._openFlyout(group, event.detail === 0);
				}
			} else if (this._flyout && !this._flyout.contains(event.target)) {
				this._closeFlyout();
			}
		});

		// the keys of a dropdown: Esc closes the menu (the focus back on its icon), the arrows move between its links;
		// the menu stands at the end of the page, so Tab leaves it as if it stood after its icon
		document.addEventListener('keydown', (event) => {
			if (!this._flyout) {
				return;
			}

			const items = [...this._flyout.querySelectorAll('.sidebar-compact-menu-item')];
			const index = items.indexOf(event.target);
			if (event.key === 'Escape') {
				this._closeFlyout(true);
			} else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && (index !== -1 || event.target === this._flyoutGroup)) {
				event.preventDefault();
				items[Math.min(Math.max(index + (event.key === 'ArrowDown' ? 1 : -1), 0), items.length - 1)].focus();
			} else if (event.key === 'Tab' && event.shiftKey && index === 0) {
				// before the first link: back on the icon
				event.preventDefault();
				this._closeFlyout(true);
			} else if (event.key === 'Tab' && !event.shiftKey && index === items.length - 1) {
				// after the last link: the focus on the icon, then the browser moves on to the next one
				this._closeFlyout(true);
			}
		});

		// the focus moving anywhere else (a click into a field, a dialog taking the focus) closes the menu
		document.addEventListener('focusin', (event) => {
			if (this._flyout && !this._flyout.contains(event.target) && event.target !== this._flyoutGroup) {
				this._closeFlyout();
			}
		});
		window.addEventListener('resize', () => this._closeFlyout());
		document.addEventListener('scroll', (event) => {
			this._hideLabel();
			if (!this._flyout?.contains(event.target)) {
				this._closeFlyout();
			}
		}, true);

		// the name of a hovered or focused link next to the compact sidebar
		const show = (event) => {
			const link = event.target.closest?.('.sidebar .list-link');
			if (link && link !== this._flyoutGroup && this.isCompact()) {
				this._showLabel(link);
			}
		};
		const hide = (event) => {
			if (event.target.closest?.('.sidebar .list-link')) {
				this._hideLabel();
			}
		};
		document.addEventListener('mouseover', show);
		document.addEventListener('focusin', show);
		document.addEventListener('mouseout', hide);
		document.addEventListener('focusout', hide);
	}

	// the text of a link of the menu without its icon and badge
	static _linkText(link) {
		return (link.querySelector('.float-start') || link).textContent.trim();
	}

	// a box next to the compact sidebar at the end of the page: the scrolling menu would cut off a box inside it
	static _place(box, link, top) {
		const rect = link.getBoundingClientRect();
		box.style.left = `${rect.right + 8}px`;
		box.style.top = `${top ?? rect.top + rect.height / 2}px`;
	}

	static _showLabel(link) {
		if (!this._label) {
			this._label = document.createElement('div');
			this._label.className = 'sidebar-compact-label';
			this._label.setAttribute('aria-hidden', 'true');
			document.body.append(this._label);
		}

		this._label.textContent = this._linkText(link);
		this._place(this._label, link);
		this._label.hidden = false;
	}

	static _hideLabel() {
		if (this._label) {
			this._label.hidden = true;
		}
	}

	/** The links of a group in a menu next to its icon in the compact sidebar; deeper levels under their name. */
	static _openFlyout(group, focus = false) {
		this._closeFlyout();

		const submenu = group.nextElementSibling;
		if (!submenu) {
			return;
		}

		const menu = document.createElement('ul');
		menu.className = 'sidebar-compact-menu';
		menu.id = 'sidebar-compact-menu';

		const add = (link, depth) => {
			const item = document.createElement('li');
			const header = link === group || link.classList.contains('link-arrow');
			const element = document.createElement(header ? 'h6' : 'a');
			element.className = header ? 'sidebar-compact-menu-header' : 'sidebar-compact-menu-item';
			element.textContent = this._linkText(link);
			if (depth) {
				element.style.paddingLeft = `${1 + depth}rem`;
			}
			if (!header) {
				element.href = link.getAttribute('href') || '#';
				if (link.classList.contains('link-current')) {
					element.classList.add('active');
					element.setAttribute('aria-current', 'page');
				}
			}
			item.append(element);
			menu.append(item);
		};

		add(group, 0);
		submenu.querySelectorAll('.list-link').forEach((link) => add(link, this._depth(link, submenu)));
		document.body.append(menu);

		// its top in line with the icon, inside the window
		const top = Math.max(8, Math.min(group.getBoundingClientRect().top - 8, window.innerHeight - menu.offsetHeight - 8));
		this._place(menu, group, top);

		this._flyout = menu;
		this._flyoutGroup = group;
		group.setAttribute('aria-controls', menu.id);
		group.setAttribute('aria-expanded', 'true');
		group.classList.add('sidebar-compact-open');
		this._hideLabel();
		if (focus) {
			menu.querySelector('.sidebar-compact-menu-item')?.focus({ preventScroll: true });
		}
	}

	/** Closes the menu of a group; `focusGroup` moves the focus back on its icon. */
	static _closeFlyout(focusGroup = false) {
		const group = this._flyoutGroup;
		if (!group) {
			return;
		}

		if (focusGroup) {
			group.focus();
		}

		// the group tells again the state of its submenu in the wide sidebar (opened by SidebarMenu by its own style)
		const submenu = group.nextElementSibling;
		group.classList.remove('sidebar-compact-open');
		group.setAttribute('aria-expanded', String(submenu?.style.display === 'block'));
		if (submenu?.id) {
			group.setAttribute('aria-controls', submenu.id);
		} else {
			group.removeAttribute('aria-controls');
		}

		this._flyout.remove();
		this._flyout = null;
		this._flyoutGroup = null;
	}

	// how many submenus a link is nested in below the submenu of its group
	static _depth(link, submenu) {
		let depth = 0;
		for (let element = link.parentElement; element && element !== submenu; element = element.parentElement) {
			depth += element.classList.contains('list-hidden') ? 1 : 0;
		}
		return depth;
	}
}
