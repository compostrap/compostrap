/**
 * SortableList: the items of a list moved by their handle, by the mouse, a finger or the keyboard.
 *
 * - `.sortable` is the list, its direct children `.sortable-item` the items, `.sortable-handle` (a button) in an
 *   item is what is grabbed; the rest of the item stays clickable and selectable.
 * - `data-sortable-group` lets the items move between all lists of the same group (the sections of a menu); a list
 *   without a group keeps its items.
 * - A `.sortable` inside an item is one level deeper (the links of a group of the menu). An item that holds such
 *   a list is not dropped into another one, so the nesting has at most two levels.
 * - Keyboard: Space or Enter grabs the item, the arrows move it (also into the next or the previous list of the
 *   group), Space or Enter drops it, Escape puts it back. Every step is read by screen readers (`messages`).
 *
 * After a drop that changed the order the item dispatches `change.bs.sortable` (it bubbles) with `detail`
 * `{ item, from, to, oldIndex, newIndex }`; SortableList.serialize(list) gives the order as the `data-id` of the
 * items, with `children` for a nested list, e.g. to send it to the server.
 *
 * Everything is delegated from the document, so lists drawn later (an AJAX snippet) need no new init().
 */
export class SortableList {
	// the time the other items take to slide to their new place (ms), 0 without animation
	static duration = 150;
	// the distance from the top or the bottom of the window where the window scrolls while dragging (px)
	static scrollEdge = 48;
	static messages = {
		grabbed: '{item} grabbed, position {position} of {count}. Arrows move it, Space drops it, Escape cancels.',
		moved: '{item}, position {position} of {count}.',
		dropped: '{item} dropped, position {position} of {count}.',
		canceled: 'Move canceled, {item} is back at position {position} of {count}.',
	};

	static _initialized = false;
	static _drag = null;
	static _grab = null;
	static _live = null;

	static init() {
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		document.addEventListener('pointerdown', (event) => this._pointerDown(event));
		document.addEventListener('keydown', (event) => this._keyDown(event));
		document.addEventListener('focusout', (event) => this._focusOut(event));
	}

	/** The order of a list as the data-id of its items, with the order of a nested list in `children`. */
	static serialize(list) {
		return this._items(list).map((item) => {
			const nested = item.querySelector(':scope > .sortable');
			return nested ? { id: item.dataset.id, children: this.serialize(nested) } : { id: item.dataset.id };
		});
	}

	// ---- pointer --------------------------------------------------------------------------------------------

	static _pointerDown(event) {
		const handle = event.target.closest?.('.sortable-handle');
		const item = handle?.closest('.sortable-item');
		const list = item?.parentElement;
		if (!handle || !list?.matches('.sortable') || event.button !== 0 || this._drag) {
			return;
		}

		event.preventDefault();
		if (this._grab) {
			this._drop(false);
		}

		const rect = item.getBoundingClientRect();
		const ghost = item.cloneNode(true);
		ghost.classList.add('sortable-ghost');
		ghost.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
		ghost.removeAttribute('id');
		ghost.setAttribute('aria-hidden', 'true');
		ghost.inert = true;
		ghost.style.width = `${rect.width}px`;
		ghost.style.height = `${rect.height}px`;
		// the list-group-item of Bootstrap has its colors from its list, so the copy takes them along
		ghost.style.setProperty('--bs-list-group-bg', getComputedStyle(list).getPropertyValue('--bs-list-group-bg'));
		document.body.append(ghost);

		this._drag = {
			item,
			ghost,
			from: list,
			oldIndex: this._items(list).indexOf(item),
			offsetX: event.clientX - rect.left,
			offsetY: event.clientY - rect.top,
			x: event.clientX,
			y: event.clientY,
			frame: 0,
		};

		item.classList.add('sortable-placeholder');
		document.documentElement.classList.add('sortable-active');
		this._moveGhost();

		this._onMove = (moveEvent) => {
			this._drag.x = moveEvent.clientX;
			this._drag.y = moveEvent.clientY;
			this._moveGhost();
			this._place();
		};
		this._onUp = () => this._endDrag(false);
		this._onCancel = () => this._endDrag(true);
		this._onEscape = (keyEvent) => {
			if (keyEvent.key === 'Escape') {
				keyEvent.preventDefault();
				this._endDrag(true);
			}
		};
		document.addEventListener('pointermove', this._onMove);
		document.addEventListener('pointerup', this._onUp);
		document.addEventListener('pointercancel', this._onCancel);
		document.addEventListener('keydown', this._onEscape, true);
		this._drag.frame = requestAnimationFrame(() => this._autoScroll());
	}

	static _moveGhost() {
		const { ghost, x, y, offsetX, offsetY } = this._drag;
		ghost.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`;
	}

	/** Moves the placeholder to the place under the pointer. */
	static _place() {
		const { item, x, y } = this._drag;
		const element = document.elementFromPoint(x, y);
		if (!element || item.contains(element)) {
			return;
		}

		// the nearest item under the pointer whose list takes the dragged item (a link of a group of another list
		// stands for its group)
		let target = element.closest('.sortable-item');
		while (target && !this._accepts(target.parentElement, item)) {
			target = target.parentElement.closest('.sortable-item');
		}

		if (target) {
			const head = this._head(target);
			if (y < head.top || y > head.bottom) {
				return;
			}

			const middle = head.top + head.height / 2;
			const sameList = target.parentElement === item.parentElement;
			const after = sameList
				? Boolean(item.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
				: y > middle;
			// in its own list the item passes another one only when the pointer is over its far half, so the item
			// does not swap back and forth while the others slide
			if (sameList && (after ? y < middle : y > middle)) {
				return;
			}

			this._moveTo(target.parentElement, after ? target.nextElementSibling : target);
			return;
		}

		// an empty list, or the space under the last item of a list
		const list = element.closest('.sortable');
		if (list && this._accepts(list, item)) {
			const items = this._items(list);
			const last = items[items.length - 1];
			if (!last || (last !== item && y > last.getBoundingClientRect().bottom)) {
				this._moveTo(list, null);
			}
		}
	}

	/** The part of an item over its nested list: the item itself when it has none. */
	static _head(item) {
		const rect = item.getBoundingClientRect();
		const nested = item.querySelector(':scope > .sortable');
		if (!nested) {
			return rect;
		}

		const bottom = nested.getBoundingClientRect().top;
		return { top: rect.top, bottom, height: bottom - rect.top };
	}

	static _autoScroll() {
		const drag = this._drag;
		if (!drag) {
			return;
		}

		const edge = this.scrollEdge;
		const step = drag.y < edge ? -(edge - drag.y) / 3 : drag.y > innerHeight - edge ? (drag.y - innerHeight + edge) / 3 : 0;
		if (step !== 0) {
			window.scrollBy(0, step);
			this._place();
		}

		drag.frame = requestAnimationFrame(() => this._autoScroll());
	}

	static _endDrag(cancel) {
		const drag = this._drag;
		if (!drag) {
			return;
		}

		cancelAnimationFrame(drag.frame);
		document.removeEventListener('pointermove', this._onMove);
		document.removeEventListener('pointerup', this._onUp);
		document.removeEventListener('pointercancel', this._onCancel);
		document.removeEventListener('keydown', this._onEscape, true);
		document.documentElement.classList.remove('sortable-active');
		drag.ghost.remove();
		drag.item.classList.remove('sortable-placeholder');
		this._drag = null;

		if (cancel) {
			this._restore(drag);
		} else {
			this._changed(drag);
		}
	}

	// ---- keyboard ---------------------------------------------------------------------------------------------

	static _keyDown(event) {
		const handle = event.target.closest?.('.sortable-handle');
		const item = handle?.closest('.sortable-item');
		if (!handle || !item?.parentElement?.matches('.sortable') || this._drag) {
			return;
		}

		const grabbed = this._grab?.item === item;

		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (grabbed) {
				this._drop(true);
			} else {
				if (this._grab) {
					this._drop(false);
				}
				this._grabItem(item, handle);
			}
		} else if (grabbed && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
			event.preventDefault();
			this._step(event.key === 'ArrowUp' ? -1 : 1);
		} else if (grabbed && event.key === 'Escape') {
			event.preventDefault();
			const grab = this._grab;
			this._release();
			this._restore(grab);
			this._announce('canceled', grab.item);
			grab.handle.focus();
		}
	}

	static _grabItem(item, handle) {
		this._grab = { item, handle, from: item.parentElement, oldIndex: this._items(item.parentElement).indexOf(item) };
		item.classList.add('sortable-grabbed');
		handle.setAttribute('aria-pressed', 'true');
		this._announce('grabbed', item);
	}

	/** Moves the grabbed item one place up or down, at the end of its list into the next list of its group. */
	static _step(direction) {
		const { item, handle } = this._grab;
		const list = item.parentElement;
		const sibling = direction < 0 ? item.previousElementSibling : item.nextElementSibling;

		if (sibling?.matches('.sortable-item')) {
			this._moveTo(list, direction < 0 ? sibling : sibling.nextElementSibling);
		} else {
			const lists = this._lists(item);
			const next = lists[lists.indexOf(list) + direction];
			if (!next) {
				return;
			}
			this._moveTo(next, direction < 0 ? null : this._items(next)[0] ?? null);
		}

		handle.focus();
		item.scrollIntoView({ block: 'nearest' });
		this._announce('moved', item);
	}

	static _drop(announce) {
		const grab = this._grab;
		this._release();
		if (announce) {
			this._announce('dropped', grab.item);
		}
		this._changed(grab);
	}

	static _release() {
		this._grab.item.classList.remove('sortable-grabbed');
		this._grab.handle.removeAttribute('aria-pressed');
		this._grab = null;
	}

	/** Leaving the handle by Tab or a click elsewhere drops the grabbed item where it is. */
	static _focusOut(event) {
		if (this._grab && !this._moving && event.target === this._grab.handle) {
			this._drop(true);
		}
	}

	// ---- shared -----------------------------------------------------------------------------------------------

	static _items(list) {
		return [...list.children].filter((child) => child.matches('.sortable-item'));
	}

	/** Whether the list takes the item: its own list, or a list of its group, not inside the item itself. */
	static _accepts(list, item) {
		const from = item.parentElement;
		if (!list?.matches('.sortable') || item.contains(list)) {
			return false;
		}
		if (list === from) {
			return true;
		}

		const group = from.dataset.sortableGroup;
		if (!group || list.dataset.sortableGroup !== group) {
			return false;
		}

		// at most two levels: a group of the menu is not dropped into another group
		return !(list.closest('.sortable-item') && item.querySelector(':scope > .sortable'));
	}

	/** All lists the item may move to, in the order of the page. */
	static _lists(item) {
		const group = item.parentElement.dataset.sortableGroup;
		if (!group) {
			return [item.parentElement];
		}

		return [...document.querySelectorAll('.sortable')]
			.filter((list) => list === item.parentElement || this._accepts(list, item));
	}

	/** Puts the item before `reference` in the list and slides the other items of the touched lists. */
	static _moveTo(list, reference) {
		const item = (this._drag ?? this._grab).item;
		if (reference === item || (reference === null && list.lastElementChild === item)) {
			return;
		}

		const animate = this.duration > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches;
		const others = animate
			? [...new Set([...list.querySelectorAll('.sortable-item'), ...item.parentElement.querySelectorAll('.sortable-item')])]
				.filter((other) => other !== item && !item.contains(other))
			: [];
		const before = new Map(others.map((other) => [other, other.getBoundingClientRect()]));

		this._moving = true;
		list.insertBefore(item, reference);
		this._moving = false;

		for (const [other, rect] of before) {
			const now = other.getBoundingClientRect();
			const dx = rect.left - now.left;
			const dy = rect.top - now.top;
			if (dx !== 0 || dy !== 0) {
				other.animate(
					[{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
					{ duration: this.duration, easing: 'ease-out' },
				);
			}
		}
	}

	static _restore({ item, from, oldIndex }) {
		this._moving = true;
		from.insertBefore(item, this._items(from).filter((other) => other !== item)[oldIndex] ?? null);
		this._moving = false;
	}

	static _changed({ item, from, oldIndex }) {
		const to = item.parentElement;
		const newIndex = this._items(to).indexOf(item);
		if (to === from && newIndex === oldIndex) {
			return;
		}

		const event = new CustomEvent('change.bs.sortable', { bubbles: true, detail: { item, from, to, oldIndex, newIndex } });
		item.dispatchEvent(event);
	}

	static _announce(message, item) {
		if (!this._live) {
			this._live = document.createElement('div');
			this._live.className = 'sortable-live visually-hidden';
			this._live.setAttribute('aria-live', 'assertive');
			document.body.append(this._live);
		}

		const items = this._items(item.parentElement);
		const handle = item.querySelector(':scope > .sortable-handle');
		const name = item.dataset.sortableLabel || handle?.getAttribute('aria-label')?.replace(/^Move\s+/, '') || item.textContent.trim();
		this._live.textContent = this.messages[message]
			.replace('{item}', name)
			.replace('{position}', String(items.indexOf(item) + 1))
			.replace('{count}', String(items.length));
	}
}
