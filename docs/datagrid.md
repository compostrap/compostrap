# Datagrid

[← Compostrap](../readme.md#documentation)

The table of a list with sorting, filters and row actions. The classes are the ones drago-ex/datagrid prints, so its table needs no styles of its own; the module has no JavaScript.

- `datagrid-table` is the table. It stands on the surface of its box (no background of its own) and is wrapped in a `table-responsive` with `tabindex="0"`, `role="region"` and an `aria-label`, so it scrolls inside the box on a narrow screen, by the keyboard too.
- `datagrid-filter-row` is the row of the filters under the column names, with `datagrid-control` fields. The cross that clears an active filter is `datagrid-filter-clear` of [elements](elements.md).
- `datagrid-control-range` is the field of a filter with a range of dates (a [datepicker](datepicker.md) with `data-bs-selection-mode="multiple-ranged"`); its wrapper keeps room for both dates.
- `datagrid-switch` on a `form-check form-switch` in a cell is a switch of a state of the row (Published, Active) with the state as its label.
- `datagrid-toolbar` holds the filters when they stand over the table, each in a `datagrid-filter` with its label.
- `datagrid-row-clickable` is a row that opens its item by a click.
- `datagrid-actions` is the narrow column of the row actions: a menu under a button of three dots, or icon buttons.
- `datagrid-actions-autohide` on a row shows its actions only under the mouse, with the focus inside the row and while their menu is open. A touch screen shows them always.

```html
<div class="table-responsive" tabindex="0" role="region" aria-label="Articles">
	<table class="table table-sm table-borderless table-hover datagrid-table">
		<thead>
			<tr>
				<th><a href="…">Title &darr;</a></th>
				<th class="text-end">&nbsp;</th>
			</tr>
			<tr class="datagrid-filter-row">
				<th class="p-1"><input type="text" class="form-control form-control-sm datagrid-control" aria-label="Title"></th>
				<th class="p-1"></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>First steps</td>
				<td class="text-end datagrid-actions">
					<div class="dropdown">
						<button type="button" class="btn btn-xs btn-icon btn-text" data-bs-toggle="dropdown" data-bs-popper-config='{"strategy":"fixed"}' aria-expanded="false" aria-label="Actions">
							<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
						</button>
						<ul class="dropdown-menu dropdown-menu-end">
							<li><a class="dropdown-item" href="…"><i class="bi bi-pencil me-2" aria-hidden="true"></i>Edit</a></li>
							<li><hr class="dropdown-divider"></li>
							<li><a class="dropdown-item text-danger" href="…"><i class="bi bi-trash me-2" aria-hidden="true"></i>Delete</a></li>
						</ul>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>
```

The button of the menu has `data-bs-popper-config='{"strategy":"fixed"}'`, or the scrolling wrapper of the table would cut the menu off.

Rows chosen by checkboxes and the bar with the actions for them are the module [selection](selection.md). A state of a row (Published, Draft) is a `badge badge-subtle` with a `theme-*` color of the [theme](theme.md).
