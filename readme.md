## Compostrap

Bootstrap 5 for administrations and websites in one package: a theme with the look, colors and classes of Bootstrap 6, a layout with a sidebar, a multi-level menu and a navbar, and components that Bootstrap does not have (gallery, dropzone, lightbox, password strength, empty states, sign-in pages…). Every part is a module that can be used alone, or all of them together.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/compostrap/compostrap/blob/main/license)
[![npm version](https://badge.fury.io/js/compostrap.svg)](https://badge.fury.io/js/compostrap)
[![Build status](https://github.com/compostrap/compostrap/actions/workflows/build.yml/badge.svg)](https://github.com/compostrap/compostrap/actions/workflows/build.yml)

## Requirements

- [Bootstrap](https://getbootstrap.com) 5.3
- [Bootstrap Icons](https://icons.getbootstrap.com) 1.11 for the arrows of the menu and the breadcrumb separators (`sidebar-menu`, `dashboard`); another icon font can be set by the Sass variables `$icon-font`, `$icon-font-weight`, `$icon-chevron-right` and `$icon-chevron-down`
- [Perfect scrollbar](https://github.com/mdbootstrap/perfect-scrollbar) when the menu scrolls with it (`sidebar-menu` styles its rail)
- [Nanobar](https://github.com/jacoborus/nanobar) when the page shows a nanobar (`dashboard` styles it)
- [Vanilla Calendar Pro](https://vanilla-calendar.pro) 3.4 for the module `datepicker` (as in Bootstrap 6)
- [Chart.js](https://www.chartjs.org) 4.6 for the module `chart`

## Installation

```bash
npm install compostrap bootstrap
```

## Architecture

The package has three layers:

| Layer | What it is | Classes |
|-------|------------|---------|
| **Theme** | Bootstrap itself, built with the variables of compostrap and finished by its CSS: the colors, buttons, badges, forms, tables, navs, overlays… in a calm, dense look | only the classes of Bootstrap 5 and of Bootstrap 6 (`btn-subtle`, `badge-subtle`, `theme-*`, `breadcrumb-link`, `avatar`…), so the markup stays valid after the upgrade to Bootstrap 6 |
| **Layout** | the frame of an administration: the sidebar, its menu, the navbar over the content and the boxes of the page | `sidebar-*`, `list-*` (menu), `navbar-*`, `content-box` |
| **Components** | what compostrap adds, each a module of its own | the name of the module as the prefix (`gallery-*`, `empty-*`, `auth-*`…) |

| Module | Layer | What it does | JavaScript |
|--------|-------|--------------|------------|
| `theme` | theme | Bootstrap in the look of compostrap: neutral grays, 14px text, quiet shadows, one size scale of buttons and form controls, the colors and variants of Bootstrap 6 | – |
| `sidebar` | layout | the sidebar: fixed on large screens, an overlay with a backdrop on small | `Sidebar` |
| `sidebar-menu` | layout | a multi-level menu in the sidebar, links as pills, the current page on any level in a pill | `SidebarMenu` |
| `dashboard` | layout | the page background, the navbar over the content with a breadcrumb, icons and the user, the content boxes, the nanobar | – |
| `theme-switcher` | component | switches the light and dark theme of Bootstrap and remembers the choice | `ThemeSwitcher` |
| `tooltip` | component | a tooltip of pure CSS for buttons and links with an icon only | – |
| `elements` | component | small pieces of a page: state dots, stat tiles, list rows, the loading state of a box | – |
| `dialogs` | component | a colored line and a confirmation of a modal, a bar of buttons at the bottom of an offcanvas | – |
| `settings` | component | a list of the sections of a page and rows of settings with their controls | – |
| `number-input` | component | a number with minus and plus buttons, e.g. the quantity in a cart | `NumberInput` |
| `datepicker` | component | the calendar of Bootstrap 6 (Vanilla Calendar Pro) under a date input | `Datepicker` |
| `chart` | component | charts of Chart.js written as markup, in the colors and fonts of the theme | `Charts` |
| `rating` | component | stars to choose a rating in a form or to show one, halves too | – |
| `gallery` | component | square tiles of images with buttons over the image on hover | – |
| `dropzone` | component | a large area to drop files on or to click, made of a plain file input | `DropzoneInput` |
| `lightbox` | component | a full-screen preview of images, browsed by arrows, keys and swipe | `Lightbox` |
| `strength` | component | a meter of the password strength under a password input (markup of Bootstrap 6) | `Strength` |
| `empty` | component | empty states in boxes and error pages (404, 403, 500, maintenance) with illustrations | – |
| `auth` | component | pages outside the administration (sign in, sign up, recovery): a box in the middle of the page | – |
| `shop` | component | the storefront of an e-shop: header with the mini cart, product tiles and detail, cart, steps of the order, choice of the delivery, price summary | `number-input` (amount) |

The components and the layout work with plain Bootstrap too; the ones with colors (`theme-*` classes) take them from the theme.

## Usage

The theme is Bootstrap built with the variables of compostrap, so it takes the place of Bootstrap's own styles:

```javascript
import 'compostrap/css/theme.css'; // instead of 'bootstrap/dist/css/bootstrap.css'
```

```scss
// own Bootstrap variables before it, e.g. $primary: #066fd1;
@import 'compostrap/src/scss/theme'; // instead of @import 'bootstrap/scss/bootstrap';
```

The other modules work with plain Bootstrap too. All of them at once:

```javascript
import 'compostrap/css/compostrap.css';
import { Sidebar, SidebarMenuApp, ThemeSwitcher, DropzoneInput, Lightbox, Strength, NumberInput } from 'compostrap';
import { Datepicker } from 'compostrap/datepicker'; // only with vanilla-calendar-pro installed
import { Charts } from 'compostrap/chart'; // only with chart.js installed

document.addEventListener('DOMContentLoaded', () => {
	Sidebar.init();
	SidebarMenuApp.init();
	new ThemeSwitcher().initialize();
});
```

Or only the modules you need, each has its own CSS and JavaScript:

```javascript
import 'compostrap/css/theme-switcher.css';
import { ThemeSwitcher } from 'compostrap/theme-switcher';

new ThemeSwitcher().initialize();
```

The styles can also be imported as SCSS:

```scss
@import 'compostrap/src/scss/compostrap';
// or a single module
@import 'compostrap/src/scss/sidebar-menu';
```

When modules are loaded one by one, load them after the theme (or Bootstrap) in the order `theme-switcher`, `tooltip`, `elements`, `dialogs`, `settings`, `number-input`, `datepicker`, `rating`, `chart`, `gallery`, `dropzone`, `lightbox`, `strength`, `empty`, `auth`, `shop`, `sidebar`, `sidebar-menu`, `dashboard`: each later one finishes the layout of the earlier ones.

## Themes

All modules follow the global theme of Bootstrap in `data-bs-theme`:

```html
<html lang="en" data-bs-theme="light">
```

The switcher stores the choice in `localStorage` under `bootstrap-theme`. To avoid a light flash of a dark page, set the stored theme before the page is drawn:

```html
<script>
	try {
		let theme = localStorage.getItem('bootstrap-theme');
		if (theme === 'auto') {
			theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		if (theme === 'light' || theme === 'dark') {
			document.documentElement.setAttribute('data-bs-theme', theme);
		}
	} catch (e) { }
</script>
```

The dashboard keeps the surface colors of Bootstrap:

| Theme | Page background            | Sidebar and content |
|-------|----------------------------|---------------------|
| Light | `var(--bs-tertiary-bg)`    | `var(--bs-body-bg)` |
| Dark  | `var(--bs-dark-bg-subtle)` | `var(--bs-body-bg)` |

## Theme

The theme changes the components of Bootstrap and adds the classes of Bootstrap 6; there are no classes of its own besides the size modifiers `badge-sm` and `btn-group-segmented`.

### Colors, buttons, alerts and badges

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

### Breadcrumb

The theme has the breadcrumb of Bootstrap 6 with its markup: links with a quiet pill on hover, a thin chevron as a separate divider, the current page in the body color.

```html
<ol class="breadcrumb">
	<li class="breadcrumb-item"><a class="breadcrumb-link" href="...">Dashboard</a></li>
	<li class="breadcrumb-divider" aria-hidden="true"></li>
	<li class="breadcrumb-item"><a class="breadcrumb-link active" aria-current="page">Blog articles</a></li>
</ol>
```

### Tabs as a segmented control

With the theme a button group with `role="tablist"` (or the class `btn-group-segmented`) looks like a segmented control: a quiet track with the active tab raised on it.

```html
<div class="btn-group" role="tablist">
	<button class="btn btn-secondary btn-sm active" type="button" role="tab" data-bs-toggle="pill" data-bs-target="#tab-1">Product</button>
	<button class="btn btn-secondary btn-sm" type="button" role="tab" data-bs-toggle="pill" data-bs-target="#tab-2">Variants</button>
</div>
```

### Offcanvas and modals

An offcanvas floats: it keeps a gap of 8px from the edges of the window, has rounded corners and a shadow instead of a border. `offcanvas-flush` keeps a panel stuck to the edge. A modal has no border, a shadow and a light line above the footer. Dropdowns have no border and a soft shadow, the chosen item is tinted instead of filled with the primary color.

## Layout

### Page

The sidebar runs over the whole height with the brand on top, the navbar sits over the content only, in the color of the page and stuck to the top:

```html
<div class="d-flex wrapper">
	<nav class="sidebar shadow-soft" id="navigation">
		<div class="sidebar-menu"><div class="sidebar-menu-fixed">
			<a class="sidebar-brand" href="/"><svg>…</svg><span>Compostrap</span></a>
			<div class="scrollbar scrollbar-use-navbar">…menu…</div>
		</div></div>
	</nav>
	<div class="layout-content">
		<header class="navbar navbar-expand-md navbar-content navbar-bar sticky-top">…breadcrumb, icons, user…</header>
		<div class="container-fluid"><main>…</main></div>
	</div>
</div>
```


The layout comes in three combinations of the navbar and the brand of the sidebar, each with the navbar stuck to the top (`sticky-top`) or scrolling away with the page:

| Combination | Navbar | Brand |
|-------------|--------|-------|
| On the page: the navbar and the brand on the background of the page, the white menu below the brand as a panel with a rounded corner, in line with the first box | `navbar-content` | `sidebar-brand sidebar-brand-page` |
| The navbar on the page, a white sidebar | `navbar-content` | `sidebar-brand` |
| A white navbar and a white sidebar; a soft shadow under the navbar when the content scrolls under it | `navbar-content navbar-bar` | `sidebar-brand` |

The white navbar can take a color, together with the brand of the sidebar, so one colored strip runs over the top: `navbar-colored` and `sidebar-brand-colored` with a `theme-*` class (`theme-primary`, `theme-success`, `theme-danger`, `theme-info`, or `theme-gray`, a gray between the light secondary and dark). Its text and icons turn light, a status dot gets a light ring, and the nanobar takes the color of the navbar, lightened; the dropdowns in it keep the colors of the page.

```html
<a class="sidebar-brand sidebar-brand-colored theme-primary" href="/">…</a>
<header class="navbar navbar-expand-md navbar-content navbar-bar navbar-colored theme-primary sticky-top">…</header>
```

The demo has a *Customize* panel to try them.

Below `md`, where the sidebar is hidden, `navbar-brand-mobile` shows the brand in the navbar (as its first item; only the logo on phones under 360px); the open sidebar covers it with its own brand at the same place.

The layout with a navbar over the whole width (`wrapper-navbar-used wrapper-navbar-fixed`, `navbar fixed-top`) works too.

### Sidebar

The sidebar is the element `#navigation`, its toggle button is `#sidebar`. On small screens it opens as an overlay over the page; the backdrop, a click on it and Escape close it, and the toggle reports its state in `aria-expanded`. From the `md` breakpoint up it stays in the layout.

| Description                                        | Class                       |
|----------------------------------------------------|-----------------------------|
| Layout without a navbar                            | `wrapper`                   |
| Layout with a navbar                               | `wrapper-navbar-used`       |
| Layout with a fixed navbar                         | `wrapper-navbar-fixed`      |
| Rounded top right corner of the sidebar            | `sidebar-rounded-top-right` |
| Fixed menu in the sidebar                          | `sidebar-menu-fixed`        |
| Soft shadow of the sidebar and boxes               | `shadow-soft`               |
| Toggle visible on small screens (used by `Sidebar`) | `sidebar-toggle`           |
| Toggle visible on all screens                      | `sidebar-toggle-visible`    |

### Sidebar menu

`SidebarMenuApp.init()` can be called again after menu items are added. It sets `aria-expanded` and `aria-controls` on submenu links, `aria-current="page"` on the current link, and opens a submenu at once; only its arrow rotates. Set `SidebarMenu.slideDuration = 200` (ms) before `init()` to slide submenus open instead; the slide is skipped when reduced motion is requested.

| Description             | Class          |
|-------------------------|----------------|
| Current item            | `link-current` |
| Link with a submenu (without `href`, it becomes a button) | `link-arrow`   |
| Hidden submenu          | `list-hidden`  |
| Shaking icon on hover   | `bell`         |

The colors of the menu come from the body color of Bootstrap (titles at 60 %, icons at 60 %, arrows at 85 %), so both themes work without settings; they can be changed by the `--sm-*` CSS variables, the sizes by the Sass variables in `src/scss/_variables.scss`. The pills of the links have `--sm-pill-border-radius`, `--sm-pill-icon-color` and `--sm-pill-link-bg`.

### Navbar

Icon buttons on the right of the navbar (module `dashboard`): `navbar-icon` is a quiet square for an icon, an icon with a short text (`navbar-icon-text`, e.g. the code of the language) widens it; tinted on hover and while its dropdown is open. A `status-dot` (module `elements`) marks that something waits; `status-dot-pulse` makes it pulse.

```html
<button type="button" class="navbar-icon" aria-label="Toggle theme" data-tooltip="bottom" data-theme-switcher
	data-theme-light-icon="bi bi-sun" data-theme-dark-icon="bi bi-moon"><i data-theme-switcher-icon class="bi bi-moon"></i></button>

<div class="dropdown">
	<button type="button" class="navbar-icon" data-bs-toggle="dropdown" aria-label="Notifications">
		<i class="bi bi-bell"></i><span class="status-dot status-dot-pulse theme-danger"></span>
		<span class="navbar-icon-text d-none d-lg-inline">Notifications</span>
	</button>
	<ul class="dropdown-menu dropdown-menu-end">…</ul>
</div>

<div class="dropdown">
	<button type="button" class="navbar-icon" data-bs-toggle="dropdown" aria-label="Language" data-tooltip="bottom"><i class="bi bi-translate"></i><span class="navbar-icon-text">EN</span></button>
	<ul class="dropdown-menu dropdown-menu-end">
		<li><a class="dropdown-item" href="...">Čeština</a></li>
		<li><a class="dropdown-item active" href="..." aria-current="true">English</a></li>
	</ul>
</div>
```

The user sits in the navbar as `navbar-user`: an `avatar` (initials or a photo in a circle, in a `theme-*` color; `avatar-sm`, `avatar-lg`) with the name and the role, the account in its dropdown.

### Content boxes and the older navbar

The navbar `navbar fixed-top` gets the page background, `navbar-nav-breadcrumb` separates its items by an arrow, and `content-box` is a box of the page content on the surface color.

## Components

### Theme switcher

The theme is light, dark or `auto`: the setting of the system, followed when the system switches. The choice is remembered in `localStorage`. The administration puts it in the user menu as a segmented control: choice buttons with `data-theme-value`, the chosen one gets `active` and `aria-pressed`. `data-bs-auto-close="outside"` on the toggle of the menu keeps it open after a click on a choice; `dropdown-theme` (module `dashboard`) lays the row out.

```html
<li class="dropdown-theme">
	<span class="dropdown-theme-label">Theme</span>
	<div class="btn-group btn-group-segmented" role="group" aria-label="Theme">
		<button type="button" class="btn btn-sm" data-theme-value="light"><i class="bi bi-sun"></i>Light</button>
		<button type="button" class="btn btn-sm" data-theme-value="dark"><i class="bi bi-moon"></i>Dark</button>
		<button type="button" class="btn btn-sm" data-theme-value="auto"><i class="bi bi-display"></i>Auto</button>
	</div>
</li>
```

A single toggle button (e.g. on a sign-in page) switches light ↔ dark; a label and an icon from any icon library are optional:

```html
<button
	type="button"
	class="btn btn-link nav-link theme-switcher"
	aria-label="Toggle theme"
	data-theme-switcher
	data-theme-light-icon="bi bi-sun"
	data-theme-dark-icon="bi bi-moon"
	data-theme-light-label="Light mode"
	data-theme-dark-label="Dark mode"
>
	<i data-theme-switcher-icon class="bi bi-moon"></i>
	<span data-theme-switcher-label>Dark mode</span>
</button>
```

`data-theme-light-label` is shown when the page is dark and the button switches to light, `data-theme-dark-label` the other way round; the shorter `data-light-label`, `data-dark-label`, `data-light-icon` and `data-dark-icon` work too. Labels are English by default. The same values can be passed to JavaScript:

```javascript
new ThemeSwitcher({
	selector: '[data-theme-switcher]',
	storageKey: 'bootstrap-theme',
	defaultTheme: 'light',
	lightIcon: '',
	darkIcon: '',
	lightLabel: 'Light mode',
	darkLabel: 'Dark mode',
}).initialize();
```

After each change the switcher dispatches `theme-switcher:change` on `window`:

```javascript
window.addEventListener('theme-switcher:change', (event) => {
	console.log(event.detail.theme, event.detail.mode); // "dark", "auto"
});
```

### Tooltip

A tooltip of pure CSS for buttons and links with an icon only: the text of `aria-label` is shown on hover and keyboard focus, dark on a light page and light on a dark one, and screen readers read it as the name. It needs no JavaScript, so it works in content loaded by AJAX too.

```html
<a href="..." class="btn btn-sm btn-danger" aria-label="Delete" data-tooltip>
	<i class="bi bi-trash" aria-hidden="true"></i>
</a>
```

`data-tooltip="left"` shows it on the left, e.g. at the right edge of a table, `data-tooltip="end"` above but aligned to its right edge (a button at the right edge of a card or an offcanvas), `data-tooltip="bottom"` under the element, e.g. in a navbar. `data-tooltip-color` colors it by a theme color of Bootstrap (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`), with dark text on the light ones:

```html
<button class="btn btn-sm btn-icon btn-secondary" aria-label="Delete" data-tooltip data-tooltip-color="danger"><i class="bi bi-trash"></i></button>
```

### Elements

The module `elements` holds small pieces of a page: a `status-dot` of a state (`theme-*` colors it, `status-dot-pulse` makes it pulse), stat tiles, list rows and the loading state of a box.

#### Stat tiles

A number of an overview with its label and an icon in a `theme-*` color; an `<a>` tile is a link to its page:

```html
<a href="..." class="stat-tile theme-primary">
	<span class="stat-icon"><i class="bi bi-box-seam"></i></span>
	<span><span class="stat-value">128</span><span class="stat-label">Products</span></span>
</a>
```

#### List rows

A row of a list in a box, e.g. what waits or the latest items: an optional icon, the text with a small second line, something on the right; no lines between the rows, a quiet tint on hover when the row is a link.

```html
<a class="list-row" href="...">
	<span class="stat-icon theme-warning"><i class="bi bi-chat-left-text"></i></span>
	<span class="list-row-text">Comments to approve<small>Blog</small></span>
	<span class="badge badge-subtle theme-warning">3</span>
</a>
```

#### Loading

A box that loads (`content-box`, `card` or any element with `data-loading-area`) gets `aria-busy="true"` while the request runs: its content fades, cannot be clicked, and a small ring turns over it. Remove the attribute when the request ends.

```js
box.setAttribute('aria-busy', 'true');
// … the request …
box.removeAttribute('aria-busy');
```

### Dialogs

The module `dialogs` adds to the modals and offcanvas panels of Bootstrap: `modal-status` is a thin colored line at the top of a modal, `modal-confirm` a narrow centered confirmation or message with a large icon and buttons of the same width. A `theme-*` class of the dialog colors the line and the icon (`theme-danger`, `theme-success`, `theme-info`, `theme-warning`…). `offcanvas-actions` is a bar of form buttons stuck to the bottom of an offcanvas while its content scrolls.

```html
<div class="modal fade" id="confirm" tabindex="-1" aria-labelledby="confirm-title" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-confirm theme-danger">
		<div class="modal-content">
			<div class="modal-status"></div>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			<div class="modal-body">
				<i class="bi bi-exclamation-triangle modal-confirm-icon" aria-hidden="true"></i>
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

### Settings

`nav-list` (module `settings`) is a vertical list of links with a count on the right, the current one in a pill of the page background; `nav-list-box` puts it in a box of the section color with the current link in the plain surface color; `setting-list` keeps a list of rows readable on wide screens (`--setting-list-max-width`, 60rem), and `setting-row-locked` (a lock and a short text, its reason in a tooltip) stands for a control that cannot be changed here; `setting-row` is a row of settings with the text on the left and a control on the right. The control keeps the least width `--setting-row-control-width` (7rem), so the texts of all rows line up.

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

### Number input

A number with a minus and a plus button, without a border: a quiet track with the buttons close to the number. A fractional `step` sets the decimals the value keeps (`step="0.25"` → 1.50), `min` and `max` disable the buttons at the ends. A step fires `input` and `change` on the input, so a form can react (e.g. recount a cart by AJAX); the keys ↑ ↓ step a text input too. The buttons draw their minus and plus themselves. `number-input-sm` and `number-input-lg` follow the heights of the form controls.

```html
<div class="number-input">
	<button type="button" class="number-input-btn" data-number-input="down" aria-label="Decrease"></button>
	<input type="number" class="form-control" name="quantity" value="1" min="1" max="99" aria-label="Quantity">
	<button type="button" class="number-input-btn" data-number-input="up" aria-label="Increase"></button>
</div>
```

```js
import { NumberInput } from 'compostrap/number-input';

NumberInput.init(); // once; inputs loaded later by AJAX work without a new init
```

### Datepicker

The calendar of Bootstrap 6: [Vanilla Calendar Pro](https://vanilla-calendar.pro) under an input with `data-bs-toggle="datepicker"`, with the same data attributes as in Bootstrap 6. The value is an ISO date (`2026-11-07`), which a server reads; `data-bs-date-format="locale"` writes it in the language of the page instead (for display). A choice fires `input` and `change`.

```html
<input type="text" class="form-control" name="published" data-bs-toggle="datepicker" autocomplete="off">
<input type="text" class="form-control" data-bs-toggle="datepicker" data-bs-date-min="today" data-bs-locale="cs-CZ">
<input type="text" class="form-control" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged" data-bs-display-months-count="2">

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

```js
import { Datepicker } from 'compostrap/datepicker'; // needs vanilla-calendar-pro

Datepicker.init(); // once; inputs loaded later open their calendar on the first focus
Datepicker.init({ locale: 'cs-CZ' }); // defaults for all datepickers
```

### Rating

Stars to choose a rating are radio inputs, so a form sends the value without JavaScript; the stars up to the checked one are filled, on hover they show the rating a click gives. A shown rating fills five stars to `--rating-value` (halves and tenths too). `rating-sm` and `rating-lg` change the size, `--rating-color` the color.

```html
<div class="rating" role="radiogroup" aria-label="Rating">
	<input type="radio" class="rating-input" name="rating" id="rating-1" value="1">
	<label class="rating-star" for="rating-1"><span class="visually-hidden">1 star</span></label>
	<!-- … up to 5 -->
</div>

<span class="rating-static" style="--rating-value: 4.5" role="img" aria-label="4.5 of 5"></span>
```

### Charts

Charts of [Chart.js](https://www.chartjs.org) written as markup, so a template prints a chart without JavaScript of its own: a `<canvas data-chart>` in a `.chart` box with the data as JSON. The colors, the font, the grid and the tooltip come from the theme, and the charts are drawn again when the light or dark theme changes. The four categorical colors (`--chart-1` … `--chart-4`: blue, orange, purple, green) are checked for color blindness and contrast on the surfaces of both themes; a series of context takes the gray `--chart-muted`. Two or more series get a legend, a tooltip shows every series at the hovered position, and every chart gets a table of its values for screen readers.

```html
<div class="chart" style="--chart-height: 16rem">
	<canvas aria-label="Revenue of the last 30 days" data-chart='{
		"type": "area",
		"labels": ["9. 10.", "10. 10.", "11. 10."],
		"series": [{"name": "Revenue", "data": [32400, 30100, 21800]}],
		"format": {"style": "currency", "currency": "CZK", "maximumFractionDigits": 0},
		"locale": "cs-CZ"
	}'></canvas>
</div>
```

| Type | For |
|------|-----|
| `area` | one series over time: a line with a light wash under it |
| `line` | series over time; `"color": "muted"` makes a series the gray context of the highlighted one |
| `bar` | columns, e.g. orders per day |
| `bar-horizontal` | ranked bars of a part-to-whole (the largest first), their values at the ends |
| `sparkline` | a small trend in a stat tile (`.chart.chart-sparkline`), the last point in the accent |

A series takes the next color, or its own `"color": 1`–`4` or `"muted"`; `null` is a missing value. `format` are the options of `Intl.NumberFormat`, `locale` their language (the `lang` of the page by default).

```js
import { Charts } from 'compostrap/chart'; // needs chart.js

Charts.init(); // draws every canvas[data-chart]; call it again (or Charts.init(snippet)) for charts loaded by AJAX
```

### Gallery

Square tiles of images in a grid of Bootstrap. The buttons appear over the dimmed image on hover or keyboard focus; on touch screens they stay shown in a column at the right edge. The name sits at the bottom of the image on a dark fade, with the extension as a small label, and gives way to the buttons on hover.

```html
<div class="row row-cols-2 row-cols-lg-4 g-3">
	<div class="col">
		<figure class="gallery-item">
			<img src="photo.jpg" alt="" loading="lazy">
			<span class="gallery-badge"><span class="badge theme-primary">Main photo</span></span>
			<figcaption class="gallery-caption" title="photo.jpg"><span class="gallery-name">photo</span><span class="gallery-ext">jpg</span></figcaption>
			<div class="gallery-actions">
				<a href="..." class="btn btn-light btn-sm btn-icon" aria-label="Preview" data-tooltip><i class="bi bi-zoom-in"></i></a>
				<a href="..." class="btn btn-danger btn-sm btn-icon" aria-label="Delete" data-tooltip><i class="bi bi-trash"></i></a>
			</div>
		</figure>
	</div>
</div>
```

`gallery-thumb` is a small square image for a table row, e.g. the photo of a product in a datagrid. `gallery-actions show` keeps the buttons shown, e.g. for the confirmation of a delete with a `gallery-text` question.

### Dropzone

A large area to drop files on or to click. It is a plain file input covering the area, so it stays the input of the form: validation and AJAX forms work as with a normal upload. It has no border; while files are dragged over it, it turns to the primary color.

```html
<label class="dropzone">
	<input type="file" name="images[]" class="dropzone-input" multiple accept="image/*" data-dropzone-submit>
	<i class="bi bi-cloud-arrow-up dropzone-icon" aria-hidden="true"></i>
	<span class="dropzone-title">Drop images here or <span class="dropzone-link">choose them</span></span>
	<span class="dropzone-hint">JPEG, PNG, GIF or WebP, at most 8 MB each.</span>
	<span class="dropzone-files" data-dropzone-files></span>
</label>
```

```javascript
import { DropzoneInput } from 'compostrap/dropzone';

DropzoneInput.init(); // again after new content is loaded, a dropzone is bound only once
```

The script highlights the area while files are dragged over it and writes the names of the chosen files into `[data-dropzone-files]`. With `data-dropzone-submit` on the input it submits the form as soon as files are chosen or dropped, so the form needs no upload button. An input with `is-invalid` tints the area red.

### Lightbox

A link with `data-lightbox` opens its image in a full-screen preview on a dark backdrop. Links with the same value form a group: the arrows, the keys ← → and a swipe browse it, a counter shows the position. `data-caption` is the text under the image. It is built on the native `<dialog>`: Esc or a click beside the image closes it and the focus returns to the link.

```html
<a href="photo-large.jpg" data-lightbox="gallery" data-caption="photo.jpg">
	<img src="photo-small.jpg" alt="">
</a>
```

```javascript
import { Lightbox } from 'compostrap/lightbox';

Lightbox.init(); // once; links loaded later by AJAX work without a new init
Lightbox.init({ dialog: 'Náhled obrázku', close: 'Zavřít', previous: 'Předchozí', next: 'Další' }); // translated labels
```

### Password strength

A meter under a password input rates the password while it is typed, with the markup of the strength component of Bootstrap 6, so the markup stays when a project moves to it. Four segments (`strength`) or one growing bar (`strength-bar`) take the colors of the levels weak, fair, good and strong; `strength-text` next to the meter shows the name of the level. The meter belongs to the password input in the same parent (or a parent up to three levels above, e.g. around a show-password wrapper).

```html
<label class="form-label" for="password">Password</label>
<input type="password" class="form-control" id="password" aria-describedby="password-strength">
<div class="strength" data-bs-strength>
	<div class="strength-segment"></div>
	<div class="strength-segment"></div>
	<div class="strength-segment"></div>
	<div class="strength-segment"></div>
</div>
<span class="strength-text" id="password-strength" aria-live="polite"></span>
```

```js
import { Strength } from 'compostrap/strength';

Strength.init(); // once; forms loaded later by AJAX work without a new init
Strength.init({ messages: { weak: 'Slabé', fair: 'Ucházející', good: 'Dobré', strong: 'Silné' } }); // translated levels
```

A point is given for 8 characters, for 12, for lower case, upper case, a digit, a special character, two special characters and for 16 characters; up to 2 points is weak, 4 fair, 6 good, more strong. `minLength`, `thresholds` and an own `scorer(password)` change it. The meter fires `strengthChange` with `detail.strength` and `detail.score`. It only helps the user: the rules of a password belong to the validation of the form.

### Empty states and error pages

The module `empty` shows that a list has nothing yet, a search found nothing, a page waits for a choice, or a whole page is an error. Every part is optional: an illustration (`empty-img`) or a small icon (`empty-icon`), the code of an error (`empty-header`), a title, a sentence and buttons. `empty-page` puts it in the middle of a page of its own.

```html
<div class="empty">
	<div class="empty-img"><!-- an illustration inlined --></div>
	<p class="empty-title">No articles yet</p>
	<p class="empty-subtitle">Write the first article of the blog, it will appear in this list.</p>
	<div class="empty-action"><a class="btn btn-primary" href="...">Add article</a></div>
</div>

<main class="empty-page">
	<div class="empty">
		<div class="empty-img"><!-- not-found.svg --></div>
		<p class="empty-header">404</p>
		<p class="empty-title">Page not found</p>
		<p class="empty-subtitle">The page you are looking for does not exist or has been moved.</p>
	</div>
</main>
```

The illustrations are in `compostrap/illustrations/`: `not-found.svg`, `forbidden.svg`, `server-error.svg`, `maintenance.svg` and `empty.svg`. Inlined into the page they take the colors of the theme from the `--cs-illustration-*` tokens (also in the dark theme); as an `<img>` they use their own light colors.

### Sign-in pages

The module `auth` lays out a page outside the administration: the brand and the theme switch above a box in the middle, a footer under it. The box is narrow; `auth-card-split` makes it wide with a visual on the left from large screens (the visual is hidden on smaller ones). `otp-code` spaces the digits of a one-time code.

```html
<body class="auth-page">
	<div class="auth">
		<div class="auth-top"><a class="auth-brand" href="/">Logo Name</a> (theme switch)</div>
		<div class="auth-card auth-card-split">
			<aside class="auth-visual" aria-hidden="true"><i class="bi bi-shield-lock"></i></aside>
			<main class="auth-body">
				<div class="auth-toolbar"><a href="..." lang="cs">Čeština</a> <a href="..." lang="en" class="active">English</a></div>
				<header class="auth-header">
					<h1 class="auth-title">Sign in to your account</h1>
					<p class="auth-subtitle">Enter your email and password to continue.</p>
				</header>
				(form)
				<div class="auth-links"><a href="...">Forgot your password?</a></div>
			</main>
		</div>
		<footer class="auth-footer">&copy; 2026 Name</footer>
	</div>
</body>
```

### Shop

The module `shop` styles the storefront of an e-shop, outside the administration: a header with a mini cart, a product list and detail, the cart, the steps of the order and the summary of prices. The page is a column with a header, a `main` and a footer, so a short page keeps the footer at the bottom. The surfaces are white boxes (`.card`) on the page color, darker in the dark theme; there are no borders. The amount of an item is the `number-input` module.

```html
<body class="shop-page">
	<header class="shop-header">
		<div class="container">
			<a class="shop-brand" href="/">Logo Name</a>
			<ul class="shop-nav"><li><a href="/products" class="active">Products</a></li></ul>
			<a class="shop-minicart" href="/cart" aria-label="Go to shopping cart">
				<span class="shop-minicart-icon"><i class="bi bi-cart3"></i><span class="badge badge-sm theme-danger rounded-pill">2</span></span>
				<span>$1,399</span>
			</a>
		</div>
	</header>
	<main class="container">…</main>
	<footer class="shop-footer"><div class="container">&copy; 2026 Name</div></footer>
</body>
```

**Product list.** Over the list, `nav.shop-sort` holds the links of the order (recommended, bestsellers, cheapest…) as `nav nav-tabs` in one row that scrolls on a phone. A tile is an `article.shop-product` with an image (`.shop-product-image`, a `badge` of the discount in `.shop-product-badge`) and a body: `.shop-product-rating` (a `rating-static rating-sm`, the value and a link with the count of reviews), `.shop-product-title`, `.shop-product-text` and `.shop-product-footer` with a row `.shop-product-buy` (a tinted strip with the prices in `.shop-product-prices`: `.shop-price` with the original one in `.shop-price-old` under it or a word such as "from" over it; a small button on the right) and the availability in the middle under it (`.shop-stock`, a text with a color class such as `text-success`). Tiles go into a Bootstrap grid (`col-6 col-md-4 col-lg-6 col-xl-4 col-xxl-3` next to the filters, `col-xl-3` without them).

**Filters.** `.shop-catalog` puts the filters into a column next to the list (`--shop-filters-width`, from lg up); below lg they are a panel: the wrapper is the responsive offcanvas of Bootstrap (`offcanvas-lg offcanvas-start`), opened by a button with `data-bs-toggle="offcanvas"`. Inside, `form.shop-filters` holds groups `fieldset.shop-filter` with a `legend.shop-filter-title` and plain `form-check` choices (the count of products in `.shop-filter-count`); `.shop-filter-range` is a row of two fields (price from – to). The chosen filters are shown over the list in `.shop-filter-chips` as links `.shop-filter-chip`, a click removes one.

**Product detail.** The photos are `.shop-detail-gallery` with a big `img.shop-detail-main` and `.shop-detail-thumbs` of `button.shop-detail-thumb` (the shown one has `active`). A choice of a variant is a `.shop-variant-group` with a `.shop-variant-title` and `.shop-variant-options` of `button.shop-variant-pill`: the chosen one has `active`, an unavailable combination is `disabled`. Switching the variants and the photos is up to the project.

**Reviews.** On the detail, `.shop-reviews-summary` shows the average (`.shop-reviews-score` with `.shop-reviews-value`, a `rating-static` and the count) next to the shares of the grades (`ul.shop-reviews-bars`, a row per grade with a `.shop-reviews-bar` filled by `--shop-reviews-share`). A review is an `article.shop-review`: `.shop-review-header` (an `avatar`, `.shop-review-author` with the name and the date, a `rating-static rating-sm`), the text, `.shop-review-points` with the lists `.shop-review-pros` and `.shop-review-cons` (a green plus and a red minus before each item) and `.shop-review-footer` with the buttons of a helpful review. The rating row of a tile (`.shop-product-rating`) is used under the name of the product too, its link leads to the reviews.

**Steps of the order.** An `ol.shop-stepper` of `li.shop-stepper-item` with a `.shop-stepper-badge` (the number, or a check icon in a done step), a `.shop-stepper-label` and a `.shop-stepper-line` that joins it with the next one. `is-done` marks a step already passed (its badge is a link back), `is-current` the present one. On phones only the current step keeps its name.

```html
<nav aria-label="Checkout steps">
	<ol class="shop-stepper">
		<li class="shop-stepper-item is-done"><a href="/cart"><span class="shop-stepper-badge"><i class="bi bi-check-lg"></i></span><span class="shop-stepper-label">Cart</span></a><span class="shop-stepper-line"></span></li>
		<li class="shop-stepper-item is-current" aria-current="step"><span><span class="shop-stepper-badge">2</span><span class="shop-stepper-label">Delivery and payment</span></span><span class="shop-stepper-line"></span></li>
		<li class="shop-stepper-item"><span><span class="shop-stepper-badge">3</span><span class="shop-stepper-label">Summary</span></span></li>
	</ol>
</nav>
```

**Cart.** A row of an item is `.shop-cart-item` with `.shop-cart-photo`, `.shop-cart-info`, `.shop-cart-qty` (a number input), `.shop-cart-price` and a button to remove it.

**Delivery and payment.** A choice is a hidden radio `.btn-check` followed by a `label.shop-option` with the name (`.shop-option-main` with a `.shop-option-icon`) and the price (`.shop-option-price`); the chosen option is tinted.

```html
<input type="radio" class="btn-check" name="carrier" id="carrier-1" checked>
<label class="shop-option" for="carrier-1">
	<span class="shop-option-main"><i class="shop-option-icon bi bi-truck"></i><span>Courier</span></span>
	<span class="shop-option-price">$5</span>
</label>
```

**Summary of prices.** `.shop-summary` holds a card that stays in view while the page scrolls (from large screens); its rows are `.shop-summary-row` and the line of the total `.shop-summary-total` with the sum in `.shop-summary-sum`.

**Bar on a phone.** `.shop-bar` is fixed at the bottom of the screen below the large breakpoint: the total (`.shop-bar-total` with `.shop-bar-label` and `.shop-bar-sum`) and the button to go on, so the button is not far below the content. The button of the summary card then gets `d-none d-lg-block` (one button at a time); from large screens the bar is hidden and the sticky `.shop-summary` is used. A page with the bar gets room under its footer.

```html
<div class="shop-bar">
	<div class="shop-bar-total"><span class="shop-bar-label">Total to pay</span><span class="shop-bar-sum">$1,404</span></div>
	<a class="btn btn-primary" href="/customer">Continue <i class="bi bi-arrow-right"></i></a>
</div>
```

**Confirmation of an order.** `.shop-confirm` is the centered block after the order is placed: `.shop-confirm-icon` (a check in a green circle), a title and a text with the number of the order. Under it go the ordered items (`.shop-cart-item` rows without the amount control), the delivery and the `.shop-summary`; all steps of the stepper are `is-done`.

## Demo

```bash
npm install
npm run dev
```

The demo is an overview of the components, one page each, with a menu by kind:

- **Overview**: `index.html`, a dashboard (stat tiles, numbers with a trend, revenue, sales by category, orders per day, this year against the last, what waits, the latest articles).
- **Bootstrap**: typography, buttons, badges and alerts, forms, tables and cards, navigation, overlays (modals, offcanvas, toasts, accordion, progress), in the look of the theme.
- **Compostrap**: `elements.html`, what the package adds to Bootstrap (tooltips, avatars, state dots, stat tiles, list rows, theme switcher).
- **Modules**: `datagrid.html`, `gallery.html` and `commerce.html` (an e-shop administration with products, variants and photos).
- **Compostrap** also has `states.html` (empty states with an illustration and with an icon, a box that loads) and `inputs.html` (number inputs and a cart that recounts, datepickers, ratings).
- **Pages**: `sign-in.html`, `sign-up.html` and `recovery.html` (module `auth`, the password strength of module `strength`; recovery goes through its three steps), and `permissions.html` (role permissions: a section list and setting rows), and the error pages `error-404.html`, `error-403.html`, `error-500.html` and `maintenance.html` (module `empty`).
- **Shop** (module `shop`, a storefront without the sidebar): `shop-products.html`, `shop-product.html`, `shop-cart.html`, `shop-delivery.html`, `shop-customer.html`, `shop-summary.html`, `shop-confirmation.html` and `shop-states.html` (an empty cart, a product out of stock, a valid and an invalid discount code, a form with errors, a cart that recounts), the whole way from the list of products to the confirmation of an order.

## Built on

- [Bootstrap 5](https://getbootstrap.com)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Perfect scrollbar](https://github.com/mdbootstrap/perfect-scrollbar)
- [Nanobar](https://github.com/jacoborus/nanobar)
