# Theme

[← Compostrap](../readme.md#documentation)

The theme changes the components of Bootstrap and adds the classes of Bootstrap 6; there are no classes of its own besides the size modifiers `badge-sm` and `form-check-sm` and `btn-group-segmented`.

## Colors, buttons, alerts and badges

The theme uses the colors of Bootstrap 6 (a lighter blue, livelier green, red and cyan). Badges look like in Bootstrap 6 and take its classes, so the markup stays valid after the upgrade: a `theme-*` class gives the color (`theme-primary`, `theme-success`, `theme-danger`, `theme-warning`, `theme-info`, `theme-secondary`…), `badge-subtle` and `badge-outline` the variant.

```html
<span class="badge theme-primary">New</span>
<span class="badge badge-subtle theme-primary">New</span>
<span class="badge badge-outline theme-primary">New</span>
<span class="badge badge-subtle">Draft</span> <!-- gray without a color -->
```

Buttons and alerts take the colors of Bootstrap 6 too. Buttons darken a little on hover; outline buttons have a light border in the color, `btn-secondary` is a light gray button. The new variants of Bootstrap 6 work with a `theme-*` class:

```html
<button class="btn btn-primary">Save</button>                 <!-- the same as btn-solid theme-primary -->
<button class="btn btn-outline-primary">Preview</button>
<button class="btn btn-subtle theme-primary">Duplicate</button>
<button class="btn btn-text theme-danger">Delete</button>
<a class="btn btn-xs btn-icon btn-outline-secondary" aria-label="Edit" data-tooltip><i class="bi bi-pencil"></i></a> <!-- 24px square icon button -->
<div class="alert alert-success">The order was paid.</div>  <!-- or alert theme-success -->
```

Alerts are the text of the color on its light tint, without a border. A `theme-*` class (and `btn-primary`, `btn-outline-primary`, `alert-primary`…) sets the CSS variables `--theme-bg`, `--theme-contrast`, `--theme-fg`, `--theme-fg-emphasis`, `--theme-bg-subtle`, `--theme-bg-muted` and `--theme-border` of its color, also for the dark theme.

## Breadcrumb

The theme has the breadcrumb of Bootstrap 6 with its markup: links with a quiet pill on hover, a thin chevron as a separate divider, the current page in the body color.

```html
<ol class="breadcrumb">
	<li class="breadcrumb-item"><a class="breadcrumb-link" href="...">Dashboard</a></li>
	<li class="breadcrumb-divider" aria-hidden="true"></li>
	<li class="breadcrumb-item"><a class="breadcrumb-link active" aria-current="page">Blog articles</a></li>
</ol>
```

## Tabs as a segmented control

With the theme a button group with `role="tablist"` (or the class `btn-group-segmented`) looks like a segmented control: a quiet track with the active tab raised on it.

```html
<div class="btn-group" role="tablist">
	<button class="btn btn-secondary btn-sm active" type="button" role="tab" data-bs-toggle="pill" data-bs-target="#tab-1">Product</button>
	<button class="btn btn-secondary btn-sm" type="button" role="tab" data-bs-toggle="pill" data-bs-target="#tab-2">Variants</button>
</div>
```

## Forms

An icon or a unit stands inside its field: the form adorn of Bootstrap 6. The wrapper is a `<label>` with `form-control form-adorn` (a click anywhere in it focuses the field), the field inside is a `form-ghost`; `form-adorn-end` moves the adornment to the end, `form-control-sm` and `form-control-lg` size it. Adornments are decorative (`aria-hidden`), and a button does not belong inside a label: a button or a select next to a field stays an `input-group`.

```html
<label class="form-control form-adorn">
	<span class="form-adorn-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
	<input type="search" class="form-ghost" placeholder="Search" aria-label="Search">
</label>

<label for="price" class="form-label">Price</label>
<label class="form-control form-adorn">
	<span class="form-adorn-text" aria-hidden="true">$</span>
	<input type="number" class="form-ghost" id="price">
</label>

<label class="form-control form-adorn form-adorn-end">
	<span class="form-adorn-text" aria-hidden="true">%</span>
	<input type="number" class="form-ghost" aria-label="Discount">
</label>
```

The variables `--form-adorn-gap`, `--form-adorn-icon-size` and `--form-adorn-icon-color` tune it.

Checks, radios and switches are 20px; `form-check-sm` makes them 16px (a 28 × 16px switch), on the wrapper or on a check without one:

```html
<div class="form-check form-check-sm">
	<input class="form-check-input" type="checkbox" id="terms">
	<label class="form-check-label" for="terms">I agree</label>
</div>
<div class="form-check form-check-sm form-switch">…</div>
<input class="form-check-input form-check-sm" type="checkbox" aria-label="Select the row">
```

On an iPhone or an iPad the text of a field is 16px instead of 14px (12px in the small size): Safari of iOS zooms the page in when a field with a smaller text gets the focus. The rule is inside `@supports (-webkit-touch-callout: none)`, which only iOS matches; the line keeps its height, so the fields are as high as elsewhere. The number of `number-input` does the same.

A field with an error of the server (`is-invalid`) also says it to a screen reader: `aria-invalid="true"` and `aria-describedby` with the `id` of its `invalid-feedback`.

```html
<input type="email" class="form-control is-invalid" id="email" aria-invalid="true" aria-describedby="email-error">
<div class="invalid-feedback" id="email-error">Please enter a valid e-mail.</div>
```

## Offcanvas and modals

An offcanvas floats: it keeps a gap of 8px from the edges of the window, has rounded corners and a shadow instead of a border; its header is tinted over the whole width, without a line under it. `offcanvas-flush` keeps a panel stuck to the edge. A modal has no border and a shadow; its header is tinted the same way, the footer has no line. Dropdowns have no border and a soft shadow, the chosen item is tinted instead of filled with the primary color. A toast follows the modals: no border, an opaque surface (a lighter one in the dark theme), larger corners and a shadow.
