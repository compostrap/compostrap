# Tooltip

[← Compostrap](../readme.md#documentation)

A tooltip of pure CSS for buttons and links with an icon only: the text of `aria-label` is shown on hover and keyboard focus, dark on a light page and light on a dark one, and screen readers read it as the name. It needs no JavaScript, so it works in content loaded by AJAX too. An optional script adds one key: Esc hides the tooltip that is shown, without moving the mouse or the focus away (WCAG 1.4.13); the first Esc goes no further, so a modal under the tooltip stays open, and the tooltip comes back when the mouse or the focus returns to the element.

```js
import { CssTooltip } from 'compostrap/tooltip';

CssTooltip.init(); // once; content loaded later works without a new init
```

```html
<a href="..." class="btn btn-sm btn-danger" aria-label="Delete" data-tooltip>
	<i class="bi bi-trash" aria-hidden="true"></i>
</a>
```

`data-tooltip="left"` shows it on the left, e.g. at the right edge of a table, `data-tooltip="end"` above but aligned to its right edge (a button at the right edge of a card or an offcanvas), `data-tooltip="start"` above but aligned to its left edge (a wide tooltip near the left edge), `data-tooltip="bottom"` under the element, e.g. in a navbar. `data-tooltip-color` colors it by a theme color of Bootstrap (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`), with dark text on the light ones (on `warning` the brown of the solid warning button):

```html
<button class="btn btn-sm btn-icon btn-secondary" aria-label="Delete" data-tooltip data-tooltip-color="danger"><i class="bi bi-trash"></i></button>
```

A tooltip is one line. A long text, such as a list, takes `data-tooltip-wrap`: it wraps within 22rem (never wider than the window), keeps the line breaks of the `aria-label` (`&#10;`, one item per line) and is aligned to the left:

```html
<span class="badge badge-subtle theme-warning" tabindex="0" data-tooltip="start" data-tooltip-wrap
	aria-label="Action:&#10;ArticleControl::handleEdit&#10;CategoryControl::handleEdit">Action</span>
```
