# Dialogs

[← Compostrap](../readme.md#documentation)

The module `dialogs` adds to the modals and offcanvas panels of Bootstrap: `modal-status` is a thin colored line at the top of a modal, `modal-confirm` a narrow centered confirmation or message with a large icon and buttons of the same width. A `theme-*` class of the dialog colors the line and the icon (`theme-danger`, `theme-success`, `theme-info`, `theme-warning`…). `offcanvas-actions` is a bar of form buttons stuck to the bottom of an offcanvas while its content scrolls.

```html
<div class="modal fade" id="confirm" tabindex="-1" aria-labelledby="confirm-title" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-confirm theme-danger">
		<div class="modal-content">
			<div class="modal-status"></div>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			<div class="modal-body">
				<i class="bi bi-dash-circle modal-confirm-icon" aria-hidden="true"></i>
				<h2 class="modal-title" id="confirm-title">Are you sure?</h2>
				<p>Do you really want to delete the item? This cannot be undone.</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
				<button type="submit" class="btn btn-danger">Delete</button>
			</div>
		</div>
	</div>
</div>
```

**A click outside.** `Dialogs.init()` makes every modal and offcanvas stay open when the user clicks outside of it, so a form in a dialog is not lost by a slip of the mouse; a dialog is closed by its cross, its Cancel button (`data-bs-dismiss`) and Esc. It sets the default `backdrop` option of Bootstrap to `static`, so it also holds for dialogs loaded later (AJAX) or opened from a script; call it before the first dialog is opened. A dialog that should close by a click outside (the search below, which has no button to close it) says so by `data-bs-backdrop="true"`. After a click outside it returns the focus to an offcanvas, so Esc still closes it (Bootstrap 5 leaves the focus outside, [twbs/bootstrap#37155](https://github.com/twbs/bootstrap/issues/37155); a modal takes it back itself). Without `Dialogs.init()` nothing changes and single dialogs can take `data-bs-backdrop="static"` of Bootstrap.

```javascript
import { Dialogs } from 'compostrap';

Dialogs.init();

// Bootstrap imported as a module instead of window.bootstrap
import { Modal, Offcanvas } from 'bootstrap';
Dialogs.init({ Modal, Offcanvas });
```

**Toasts.** The container is a named region (`role="region"`, `aria-label`), so a screen reader finds the messages. `toast-status` is a toast with the message of a state (a flash message: saved, deleted, failed) in the look of the modals: a thin colored line at the top, an icon in the color, a title and a quiet text. A `theme-*` class colors the line and the icon. The toasts stand in a `toast-container` of Bootstrap in a corner of the window and are shown by `bootstrap.Toast`, which also hides them after a while.

```html
<div class="toast-container position-fixed bottom-0 end-0 p-3" role="region" aria-label="Notifications">
	<div class="toast toast-status theme-success" role="status" aria-live="polite" aria-atomic="true">
		<i class="bi bi-check-circle toast-status-icon" aria-hidden="true"></i>
		<div class="toast-status-body">
			<strong class="toast-status-title">Saved</strong>
			<p>The changes of the article were saved.</p>
		</div>
		<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
	</div>
</div>
```

```javascript
document.querySelectorAll('.toast-status').forEach((toast) => bootstrap.Toast.getOrCreateInstance(toast).show());
```

**Search.** `modal-search` is a search of the whole administration as a dialog, opened by a `navbar-icon` button with a magnifier: one large field without a frame at the top (`modal-search-form`, `modal-search-input`) and the results under it (`modal-search-results`) as `list-row` links in groups with a `modal-search-title`; `modal-search-empty` is the text when nothing is found. The results are drawn by the server (or by an own script), compostrap only styles them.

```html
<button type="button" class="navbar-icon" data-bs-toggle="modal" data-bs-target="#search" aria-label="Search"><i class="bi bi-search" aria-hidden="true"></i><span class="navbar-icon-text d-none d-lg-inline">Search</span></button>

<div class="modal fade" id="search" tabindex="-1" aria-label="Search" aria-hidden="true" data-bs-backdrop="true">
	<div class="modal-dialog modal-search">
		<div class="modal-content">
			<form class="modal-search-form" role="search">
				<i class="bi bi-search" aria-hidden="true"></i>
				<input type="search" class="modal-search-input" name="q" placeholder="Search…" aria-label="Search" autocomplete="off">
				<kbd>Esc</kbd>
			</form>
			<div class="modal-search-results">
				<p class="modal-search-title">Articles</p>
				<a class="list-row" href="...">
					<span class="stat-icon theme-primary"><i class="bi bi-journal-text" aria-hidden="true"></i></span>
					<span class="list-row-text">How to write a good article<small>Tips · Draft</small></span>
				</a>
			</div>
		</div>
	</div>
</div>
```
