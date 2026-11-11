# Settings

[← Compostrap](../readme.md#documentation)

The module `settings` holds a list of the sections of a page and rows of settings:

- `nav-list` is a vertical list of links with a count on the right, the current one in a pill of the page background.
- `nav-list-box` puts it in a box of the section color with the current link in the plain surface color.
- `setting-row` is a row of settings with the text on the left and a control on the right. The control keeps the least width `--setting-row-control-width` (7rem), so the texts of all rows line up.
- `setting-list` keeps a list of rows readable on wide screens (`--setting-list-max-width`, 60rem).
- `setting-row-locked` (a lock and a short text, its reason in a tooltip) stands for a control that cannot be changed here.

```html
<nav class="nav-list" aria-label="Presenters">
	<a class="nav-list-link active" aria-current="true" href="...">Blog<span class="nav-list-count">4/5</span></a>
</nav>

<div class="setting-row">
	<div class="setting-row-text">Approving comments</div>
	<div class="setting-row-control form-check form-switch">
		<input class="form-check-input" type="checkbox" role="switch" id="approve" checked>
		<label class="form-check-label" for="approve">Allowed</label>
	</div>
</div>
```
