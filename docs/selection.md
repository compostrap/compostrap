# Selection

[← Compostrap](../readme.md#documentation)

Rows of a table chosen by checkboxes and a bar with the actions for them (the bulk actions of a datagrid).

- `data-selection` is the wrapper of the table and the bar.
- `data-selection-all` is the checkbox that checks all `data-selection-item` checkboxes and shows a dash when only some are checked.
- `table-active` is the class a chosen row gets.
- `selection-bar` (`data-selection-bar`) is the bar, hidden until a row is chosen. It floats over the bottom edge of the window while its table is on the screen and stays inside its box.
- `data-selection-count` holds the number of the chosen rows.
- `data-selection-clear` unchecks them.
- `selection-cell` is the narrow column of the checkboxes.

```html
<form class="content-box" data-selection>
	<table class="table">
		<thead>
			<tr>
				<th class="selection-cell"><input type="checkbox" class="form-check-input" data-selection-all aria-label="Select all"></th>
				<th>Title</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="selection-cell"><input type="checkbox" class="form-check-input" data-selection-item name="ids[]" value="1" aria-label="Select the row"></td>
				<td>First steps</td>
			</tr>
		</tbody>
	</table>

	<div class="selection-bar" data-selection-bar hidden>
		<span class="selection-count"><strong data-selection-count>0</strong> selected</span>
		<div class="selection-actions">
			<button type="submit" name="publish" class="btn btn-sm btn-secondary">Publish</button>
			<button type="submit" name="delete" class="btn btn-sm btn-subtle theme-danger">Delete</button>
		</div>
		<button type="button" class="btn-close" data-selection-clear aria-label="Clear the selection"></button>
	</div>
</form>
```

```javascript
import { RowSelection } from 'compostrap/selection';

RowSelection.init();
```

The checkboxes are found on every change, so a table drawn again by AJAX needs no new `init()`; `RowSelection.update(wrapper)` brings the bar in line with the new rows and `RowSelection.clear(wrapper)` unchecks them. The bar can be changed by `--selection-bar-bg`, `--selection-bar-box-shadow`, `--selection-bar-border-radius` and `--selection-bar-offset` (its distance from the bottom edge).
