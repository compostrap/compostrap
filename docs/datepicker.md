# Datepicker

[← Compostrap](../readme.md#documentation)

The calendar of Bootstrap 6: [Vanilla Calendar Pro](https://vanilla-calendar.pro) under an input with `data-bs-toggle="datepicker"`, with the same data attributes as in Bootstrap 6. The value is an ISO date (`2026-11-07`), with a time `2026-11-07 14:30`, which a server reads; `data-bs-date-format="locale"` writes it in the language of the page instead (for display). A choice fires `input` and `change`.

```html
<input type="text" class="form-control" name="published" data-bs-toggle="datepicker" autocomplete="off">
<input type="text" class="form-control" data-bs-toggle="datepicker" data-bs-date-min="today" data-bs-locale="cs-CZ">
<input type="text" class="form-control" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged" data-bs-display-months-count="2">
<input type="text" class="form-control" data-bs-toggle="datepicker" data-bs-selection-time-mode="24" value="2026-11-07 14:30">

<!-- in the page, the value in the hidden input -->
<div data-bs-toggle="datepicker" data-bs-inline="true"><input type="hidden" name="day"></div>
```

| Attribute | Value |
|-----------|-------|
| `data-bs-date-min`, `data-bs-date-max` | an ISO date or `today` |
| `data-bs-selection-mode` | `single` (default), `multiple`, `multiple-ranged` |
| `data-bs-display-months-count` | months side by side |
| `data-bs-first-weekday` | 1 = Monday (default) |
| `data-bs-locale` | the language of the month and day names, the `lang` of the page by default |
| `data-bs-date-format` | `iso` (default) or `locale` |
| `data-bs-inline` | `true` shows the calendar in the page |
| `data-bs-selection-time-mode` | `24` or `12`: the hour and the minute under the calendar (fields and sliders); the value gets the time after the date and the calendar stays open after a click on a day |

A field that opens the calendar shows a small calendar icon at its end (`$datepicker-icon`, `$datepicker-icon-color`); a field in an `input-group` has none, its icon stands in the group.

```js
import { Datepicker } from 'compostrap/datepicker'; // needs vanilla-calendar-pro

Datepicker.init(); // once; inputs loaded later open their calendar on the first focus
Datepicker.init({ locale: 'cs-CZ' }); // defaults for all datepickers
```
