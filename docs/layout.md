# Layout

[← Compostrap](../readme.md#documentation)

## Page

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

## Sidebar

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

## Sidebar menu

`SidebarMenuApp.init()` can be called again after menu items are added. It sets `aria-expanded` and `aria-controls` on submenu links, `aria-current="page"` on the current link, and opens a submenu at once; only its arrow rotates. Set `SidebarMenu.slideDuration = 200` (ms) before `init()` to slide submenus open instead; the slide is skipped when reduced motion is requested.

| Description             | Class          |
|-------------------------|----------------|
| Current item            | `link-current` |
| Link with a submenu (without `href`, it becomes a button) | `link-arrow`   |
| Hidden submenu          | `list-hidden`  |
| Shaking icon on hover   | `bell`         |

The colors of the menu come from the body color of Bootstrap (titles at 60 %, icons at 60 %, arrows at 85 %), so both themes work without settings; they can be changed by the `--sm-*` CSS variables, the sizes by the Sass variables in `src/scss/_variables.scss`. The pills of the links have `--sm-pill-border-radius`, `--sm-pill-icon-color`, `--sm-pill-link-bg` (the current page) and `--sm-pill-hover-bg` (a hovered link, a bit weaker).

### Compact sidebar

From the `md` breakpoint up the sidebar can be narrowed to the icons of the first level (`$sm-compact-width`, 72px); a phone keeps its sliding menu. A button with `data-sidebar-compact` switches the class `sidebar-compact` of `<html>`, keeps its `aria-pressed` in line and remembers the choice in `localStorage` (`sidebar-compact`); it is handled by `Sidebar.init()`. In the compact sidebar:

- the brand shows only its logo, a section title becomes a short line, badges and submenus are hidden (a group holding the current page gets its pill);
- the name of a hovered or focused link is shown next to it in the colors of the tooltip;
- a link with a submenu opens its links in a menu of the theme next to the icon (the group name over them, the current page marked); it is closed by another click on the icon, a click outside, Esc or a scroll, and works by the keyboard like a dropdown (Enter or Space moves the focus into it, the arrows between the links, Tab leaves it to the next icon).

```html
<html class="…">
<head>
	<!-- the remembered compact sidebar before the page is drawn, so the menu does not jump -->
	<script>try { if (localStorage.getItem('sidebar-compact') === '1') document.documentElement.classList.add('sidebar-compact'); } catch (e) { }</script>
</head>
…
<button type="button" class="navbar-icon" data-sidebar-compact aria-pressed="false" aria-label="Compact menu" data-tooltip="bottom">
	<i class="bi bi-layout-sidebar" aria-hidden="true"></i>
</button>
```

`Sidebar.setCompact(true|false)` sets it from a script, `Sidebar.isCompact()` tells whether the compact sidebar is shown.

## Navbar

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

## Content boxes and the older navbar

The navbar `navbar fixed-top` gets the page background, `navbar-nav-breadcrumb` separates its items by an arrow, and `content-box` is a box of the page content on the surface color.
