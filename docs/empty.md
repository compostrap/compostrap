# Empty states and error pages

[← Compostrap](../readme.md#documentation)

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
