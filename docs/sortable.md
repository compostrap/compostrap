# Sortable

[← Compostrap](../readme.md#documentation)

Items of a list moved by a handle of dots: by the mouse, a finger or the keyboard. Made for the order of the menu of the administration (the links the packages add, put in order by the user), the photos of a product or any rows of a list.

- `sortable` is the list, its direct children `sortable-item` are the items. A `list-group` of Bootstrap gives the rows their look; the module only lays out an item as a row (the handle, then the content).
- `sortable-handle` is a button with six dots, drawn by the module (no icon font). Only the handle starts a move, so the rest of an item stays a link, a text to select or a form.
- `data-sortable-group` lets the items move between all lists of the same group (the sections of the menu). A list without a group keeps its items.
- `sortable-nested` is a list inside an item, one level deeper (the links of a group of the menu). An item that holds a nested list is not dropped into another nested list, so there are at most two levels.
- `data-sortable-empty` is the text of an empty list, which stays a place to drop on.
- `data-id` of an item is what `SortableList.serialize()` returns.

While moving, the item stays in the list as a tinted place with a dashed line (`sortable-placeholder`) and a copy follows the pointer (`sortable-ghost`); the other items slide to their new places. An item grabbed by the keyboard is `sortable-grabbed` and its handle `aria-pressed="true"`.

```html
<ul class="list-group sortable" data-sortable-group="menu" data-sortable-empty="Drop a link here">
	<li class="list-group-item sortable-item" data-id="blog">
		<button type="button" class="sortable-handle" aria-label="Move Blog"></button>
		<i class="bi bi-journal-text" aria-hidden="true"></i>
		<span class="list-row-text">Blog</span>
		<ul class="list-group sortable sortable-nested" data-sortable-group="menu" data-sortable-empty="Drop a link here">
			<li class="list-group-item sortable-item" data-id="blog.articles">
				<button type="button" class="sortable-handle" aria-label="Move Articles"></button>
				<span class="list-row-text">Articles</span>
			</li>
		</ul>
	</li>
	<li class="list-group-item sortable-item" data-id="pages">
		<button type="button" class="sortable-handle" aria-label="Move Pages"></button>
		<i class="bi bi-file-earmark-text" aria-hidden="true"></i>
		<span class="list-row-text">Pages</span>
	</li>
</ul>
```

## JavaScript

```js
import { SortableList } from 'compostrap'; // or 'compostrap/sortable'

SortableList.init();

document.addEventListener('change.bs.sortable', (event) => {
	const { item, from, to, oldIndex, newIndex } = event.detail;
	// e.g. send the new order: SortableList.serialize(list)
});
```

- `SortableList.init()` once; it listens on the document, so lists drawn later (an AJAX snippet) need nothing more.
- `change.bs.sortable` bubbles from the moved item after a drop that changed the order (not after a drop at the same place or a cancel).
- `SortableList.serialize(list)` gives the order as `[{ id: 'blog', children: [{ id: 'blog.articles' }] }, { id: 'pages' }]`.
- Keyboard: Space or Enter on a handle grabs the item, the arrows move it (at the end of a list into the next or the previous list of its group), Space or Enter drops it, Escape puts it back, Tab away drops it where it is. Escape also cancels a drag of the mouse.
- Screen readers hear every step from a live region (`sortable-live`). The texts are in `SortableList.messages` (`{item}`, `{position}`, `{count}`); the name of an item is its `data-sortable-label`, or the `aria-label` of its handle without the word Move, or its text.
- `SortableList.duration` is the time of the sliding of the other items (150 ms, 0 turns it off; nothing slides with reduced motion), `SortableList.scrollEdge` the distance from the edge of the window where it scrolls while dragging (48 px).

## Variables

`--sortable-handle-size`, `--sortable-handle-color`, `--sortable-place-bg`, `--sortable-place-line` (the tint and the line of the place and of a grabbed item) and `--sortable-indent` (the indent of a nested list) are set on `.sortable`.
