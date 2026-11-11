# Elements

[← Compostrap](../readme.md#documentation)

The module `elements` holds small pieces of a page: a `status-dot` of a state (`theme-*` colors it, `status-dot-pulse` makes it pulse), stat tiles, list rows, the loading state of a box and the cross that clears an active filter of a datagrid (`datagrid-filter-clear` on a `btn btn-secondary btn-sm` in an `input-group input-group-sm` with the field: a darker gray button with a white cross in both themes).

## Stat tiles

A number of an overview with its label and an icon in a `theme-*` color; an `<a>` tile is a link to its page:

```html
<a href="..." class="stat-tile theme-primary">
	<span class="stat-icon"><i class="bi bi-box-seam"></i></span>
	<span><span class="stat-value">128</span><span class="stat-label">Products</span></span>
</a>
```

## List rows

A row of a list in a box, e.g. what waits or the latest items: an optional icon, the text with a small second line, something on the right; no lines between the rows, a quiet tint on hover when the row is a link.

```html
<a class="list-row" href="...">
	<span class="stat-icon theme-warning"><i class="bi bi-chat-left-text"></i></span>
	<span class="list-row-text">Comments to approve<small>Blog</small></span>
	<span class="badge badge-subtle theme-warning">3</span>
</a>
```

## Loading

A box that loads (`content-box`, `card` or any element with `data-loading-area`) gets `aria-busy="true"` while the request runs: its content fades, cannot be clicked, and a small ring turns over it. Remove the attribute when the request ends.

```js
box.setAttribute('aria-busy', 'true');
// … the request …
box.removeAttribute('aria-busy');
```
