## Compostrap

Bootstrap 5 for administrations and websites in one package: a theme with the look, colors and classes of Bootstrap 6, a layout with a sidebar, a multi-level menu and a navbar, and components that Bootstrap does not have (gallery, dropzone, lightbox, password strength, empty states, sign-in pages…). Every part is a module that can be used alone, or all of them together.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/compostrap/compostrap/blob/main/license)
[![npm version](https://badge.fury.io/js/compostrap.svg)](https://badge.fury.io/js/compostrap)
[![Build status](https://github.com/compostrap/compostrap/actions/workflows/build.yml/badge.svg)](https://github.com/compostrap/compostrap/actions/workflows/build.yml)

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Architecture](#architecture): the three layers and the table of the modules
- [Usage](#usage)
- [Light and dark theme](#light-and-dark-theme)
- [Documentation](#documentation): the theme, the layout and every component
- [Demo](#demo)
- [Tests](#tests)

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
| [`theme`](docs/theme.md) | theme | Bootstrap in the look of compostrap: neutral grays, 14px text, quiet shadows, one size scale of buttons and form controls, the colors and variants of Bootstrap 6 | – |
| [`sidebar`](docs/layout.md#sidebar) | layout | the sidebar: fixed on large screens, an overlay with a backdrop on small | `Sidebar` |
| [`sidebar-menu`](docs/layout.md#sidebar-menu) | layout | a multi-level menu in the sidebar, links as pills, the current page on any level in a pill; a compact sidebar with the icons only | `SidebarMenu`, `Sidebar` (compact) |
| [`dashboard`](docs/layout.md) | layout | the page background, the navbar over the content with a breadcrumb, icons and the user, the content boxes, the nanobar | – |
| [`theme-switcher`](docs/theme-switcher.md) | component | switches the light and dark theme of Bootstrap and remembers the choice | `ThemeSwitcher` |
| [`tooltip`](docs/tooltip.md) | component | a tooltip of pure CSS for buttons and links with an icon only | `CssTooltip` (optional: Esc hides it) |
| [`elements`](docs/elements.md) | component | small pieces of a page: state dots, stat tiles, list rows, the loading state of a box | – |
| [`dialogs`](docs/dialogs.md) | component | a colored line and a confirmation of a modal, a bar of buttons at the bottom of an offcanvas, a toast with the message of a state, a search dialog; dialogs that stay open on a click outside | `Dialogs` |
| [`settings`](docs/settings.md) | component | a list of the sections of a page and rows of settings with their controls | – |
| [`datagrid`](docs/datagrid.md) | component | the table of a list: the row of filters, clickable rows and the column of row actions | – |
| [`selection`](docs/selection.md) | component | rows of a table chosen by checkboxes and a bar with the actions for them | `RowSelection` |
| [`number-input`](docs/number-input.md) | component | a number with minus and plus buttons, e.g. the quantity in a cart | `NumberInput` |
| [`otp-input`](docs/otp-input.md) | component | a one-time code typed into separate slots over one real input (the OTP input of Bootstrap 6) | `OtpInput` |
| [`datepicker`](docs/datepicker.md) | component | the calendar of Bootstrap 6 (Vanilla Calendar Pro) under a date input | `Datepicker` |
| [`chart`](docs/chart.md) | component | charts of Chart.js written as markup, in the colors and fonts of the theme | `Charts` |
| [`rating`](docs/rating.md) | component | stars to choose a rating in a form or to show one, halves too | – |
| [`gallery`](docs/gallery.md) | component | square tiles of images with buttons over the image on hover | – |
| [`dropzone`](docs/dropzone.md) | component | a large area to drop files on or to click, made of a plain file input | `DropzoneInput` |
| [`lightbox`](docs/lightbox.md) | component | a full-screen preview of images, browsed by arrows, keys and swipe | `Lightbox` |
| [`strength`](docs/strength.md) | component | a meter of the password strength under a password input (markup of Bootstrap 6) | `Strength` |
| [`password-toggle`](docs/password-toggle.md) | component | a button with an eye in a password input that shows and hides the password | `PasswordToggle` |
| [`empty`](docs/empty.md) | component | empty states in boxes and error pages (404, 403, 500, maintenance) with illustrations | – |
| [`spinner`](docs/spinner.md) | component | shows that a request runs: a line at the top of the window, or a dark overlay that stops clicks | `Spinner` |
| [`auth`](docs/auth.md) | component | pages outside the administration (sign in, sign up, recovery): a box in the middle of the page | – |
| [`shop`](docs/shop.md) | component | the storefront of an e-shop: header with the mini cart, product tiles and detail, cart, steps of the order, choice of the delivery, price summary | `number-input` (amount) |
| [`blog`](docs/blog.md) | component | a website with a blog: header with the links, list of articles with categories, an article with its text, comments | `avatar` of the theme |

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

When modules are loaded one by one, load them after the theme (or Bootstrap) in the order `theme-switcher`, `tooltip`, `elements`, `dialogs`, `settings`, `datagrid`, `selection`, `number-input`, `otp-input`, `datepicker`, `rating`, `chart`, `gallery`, `dropzone`, `lightbox`, `strength`, `password-toggle`, `empty`, `spinner`, `auth`, `shop`, `blog`, `sidebar`, `sidebar-menu`, `dashboard`: each later one finishes the layout of the earlier ones.

## Light and dark theme

All modules follow the global theme of Bootstrap in `data-bs-theme`:

```html
<html lang="en" data-bs-theme="light">
```

The switcher stores the choice in `localStorage` under `bootstrap-theme`; without a stored choice the page follows the system. To avoid a light flash of a dark page, set the theme before the page is drawn:

```html
<script>
	try {
		let theme = localStorage.getItem('bootstrap-theme') || 'auto';
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
| Light | `--bs-tertiary-bg` darkened by 1.6 % (`#f6f6f6` in the theme) | `var(--bs-body-bg)` |
| Dark  | `--bs-body-bg` mixed 55 % with black | `var(--bs-body-bg)` |

## Documentation

Every module is described in `docs/`, with its markup, classes, variables and JavaScript:

- **Theme**: [theme](docs/theme.md) (colors, buttons, alerts and badges, breadcrumb, tabs as a segmented control, forms, offcanvas and modals)
- **Layout**: [layout](docs/layout.md) ([page](docs/layout.md#page), [sidebar](docs/layout.md#sidebar), [sidebar menu](docs/layout.md#sidebar-menu) and its [compact form](docs/layout.md#compact-sidebar), [navbar](docs/layout.md#navbar), [content boxes](docs/layout.md#content-boxes-and-the-older-navbar))
- **Components**: [theme switcher](docs/theme-switcher.md), [tooltip](docs/tooltip.md), [elements](docs/elements.md), [dialogs](docs/dialogs.md), [settings](docs/settings.md), [datagrid](docs/datagrid.md), [selection](docs/selection.md), [number input](docs/number-input.md), [OTP input](docs/otp-input.md), [datepicker](docs/datepicker.md), [rating](docs/rating.md), [charts](docs/chart.md), [gallery](docs/gallery.md), [dropzone](docs/dropzone.md), [lightbox](docs/lightbox.md), [password strength](docs/strength.md), [password toggle](docs/password-toggle.md), [empty states and error pages](docs/empty.md), [spinner](docs/spinner.md), [sign-in pages](docs/auth.md), [shop](docs/shop.md), [blog](docs/blog.md)

## Demo

The demo runs at [compostrap.github.io/demo](https://compostrap.github.io/demo/). To run it from the package:

```bash
npm install
npm run dev
```

The demo is an overview of the components, one page each, with a menu by kind:

- **Overview**: `index.html`, a dashboard (stat tiles, numbers with a trend, revenue, sales by category, orders per day, this year against the last, what waits, the latest articles).
- **Bootstrap**: typography, buttons, badges and alerts, forms, tables and cards, navigation, overlays (modals, offcanvas, toasts, accordion, progress), in the look of the theme.
- **Compostrap**: `elements.html`, what the package adds to Bootstrap (tooltips, avatars, state dots, stat tiles, list rows, theme switcher).
- **Modules**: `datagrid.html`, `gallery.html` and `commerce.html` (an e-shop administration with products, variants and photos).
- **Compostrap** also has `states.html` (empty states with an illustration and with an icon, a box that loads, both spinners) and `inputs.html` (number inputs and a cart that recounts, one-time codes, datepickers, ratings).
- **Pages**: `sign-in.html`, `sign-up.html` and `recovery.html` (module `auth`, the password strength of module `strength`, the eye in the password inputs of module `password-toggle`; recovery goes through its three steps, its code is typed into the slots of module `otp-input`), `account.html` (the account of the signed-in user: profile information and the change of the password next to each other) and `permissions.html` (role permissions: a section list and setting rows), and the error pages `error-404.html`, `error-403.html`, `error-500.html` and `maintenance.html` (module `empty`).
- **Blog** (module `blog`, a website without the sidebar): `blog-articles.html` (categories, the newest article, cards) and `blog-article.html` (an article with its text, comments and the comment form).
- **Shop** (module `shop`, a storefront without the sidebar): `shop-products.html`, `shop-product.html`, `shop-cart.html`, `shop-delivery.html`, `shop-customer.html`, `shop-summary.html`, `shop-confirmation.html` and `shop-states.html` (an empty cart, a product out of stock, a valid and an invalid discount code, a form with errors, a cart that recounts), the whole way from the list of products to the confirmation of an order.

## Tests

```bash
npx playwright install chromium   # once
npm test
```

Smoke tests in Playwright over the demo pages: every page loads without an error, and the JavaScript modules (sidebar and its compact form, menu, theme switcher, number input, OTP input, password toggle, strength, row selection, lightbox, dropzone, datepicker, charts, spinner) behave as described here.

## Built on

- [Bootstrap 5](https://getbootstrap.com)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Perfect scrollbar](https://github.com/mdbootstrap/perfect-scrollbar)
- [Nanobar](https://github.com/jacoborus/nanobar)
- [Vanilla Calendar Pro](https://vanilla-calendar.pro)
- [Chart.js](https://www.chartjs.org)
