// Builds the demo pages (*.html in the root, served by `npm run dev`) from demo/_layout.html and demo/pages/*.html.
// A page source holds its content; an optional `<!-- overlays -->` line starts its offcanvases and modals.
// A page with `layout` is filled into demo/_layout-<layout>.html instead (auth: sign-in pages without sidebar and navbar).
// The menu below has a section per kind of components, the current page is marked in it and in the breadcrumb.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const menu = [
	{ title: 'Overview', items: [
		{ file: 'index.html', title: 'Dashboard', icon: 'bi-house-door' },
	] },
	{ title: 'Bootstrap', items: [
		{ file: 'typography.html', title: 'Typography', icon: 'bi-fonts' },
		{ file: 'buttons.html', title: 'Buttons', icon: 'bi-hand-index' },
		{ file: 'badges.html', title: 'Badges & alerts', icon: 'bi-patch-check' },
		{ file: 'forms.html', title: 'Forms', icon: 'bi-ui-checks' },
		{ file: 'tables.html', title: 'Tables & cards', icon: 'bi-table' },
		{ file: 'navigation.html', title: 'Navigation', icon: 'bi-signpost-2' },
		{ file: 'overlays.html', title: 'Overlays', icon: 'bi-window-stack' },
	] },
	{ title: 'Compostrap', items: [
		{ file: 'elements.html', title: 'Elements', icon: 'bi-stars' },
		{ file: 'states.html', title: 'Empty & loading', icon: 'bi-inbox' },
		{ file: 'inputs.html', title: 'Inputs', icon: 'bi-input-cursor-text', new: true },
	] },
	{ title: 'Modules', items: [
		{ file: 'datagrid.html', title: 'Datagrid', icon: 'bi-grid-3x3-gap', badge: '3' },
		{ file: 'gallery.html', title: 'Gallery', icon: 'bi-images' },
		{ file: 'sortable.html', title: 'Sortable', icon: 'bi-arrow-down-up' },
		// a submenu (link-arrow + list-hidden): it opens by itself when its page is the current one
		{ title: 'Commerce', icon: 'bi-shop', items: [
			{ file: 'commerce.html', title: 'Products' },
		] },
	] },
	{ title: 'Pages', items: [
		{ file: 'sign-in.html', title: 'Sign in', icon: 'bi-box-arrow-in-right', layout: 'auth' },
		{ file: 'sign-up.html', title: 'Sign up', icon: 'bi-person-plus', layout: 'auth' },
		{ file: 'recovery.html', title: 'Password recovery', icon: 'bi-key', layout: 'auth' },
		{ file: 'account.html', title: 'Account', icon: 'bi-person-gear' },
		{ file: 'permissions.html', title: 'Permissions', icon: 'bi-shield-lock' },
		// the storefront of an e-shop (module shop): its own shell without sidebar and navbar
		{ title: 'Shop', icon: 'bi-bag', items: [
			{ file: 'shop-products.html', title: 'Products', layout: 'shop' },
			{ file: 'shop-product.html', title: 'Product detail', layout: 'shop' },
			{ file: 'shop-cart.html', title: 'Cart', layout: 'shop' },
			{ file: 'shop-delivery.html', title: 'Delivery and payment', layout: 'shop' },
			{ file: 'shop-customer.html', title: 'Customer information', layout: 'shop' },
			{ file: 'shop-summary.html', title: 'Order summary', layout: 'shop' },
			{ file: 'shop-confirmation.html', title: 'Order confirmation', layout: 'shop' },
			{ file: 'shop-states.html', title: 'Cart and form states', layout: 'shop' },
		] },
		// a website with a blog (module blog): its own shell with a navbar of links and a footer
		{ title: 'Blog', icon: 'bi-journal-text', items: [
			// the article is opened from the list, so it has no item of its own in the menu (hidden: built, not listed)
			{ file: 'blog-articles.html', title: 'Articles', layout: 'blog' },
			{ file: 'blog-article.html', title: 'Article', layout: 'blog', hidden: true },
		] },
		{ title: 'Errors', icon: 'bi-exclamation-octagon', items: [
			{ file: 'error-404.html', title: 'Not found (404)', layout: 'error' },
			{ file: 'error-403.html', title: 'Access denied (403)', layout: 'error' },
			{ file: 'error-500.html', title: 'Server error (500)', layout: 'error' },
			{ file: 'maintenance.html', title: 'Maintenance', layout: 'error' },
		] },
	] },
];

const indent = (text, tabs) => text.split('\n').map((l) => (l ? '\t'.repeat(tabs) + l : l)).join('\n');

const itemHtml = (item, current) => {
	// a count of the item (badge), or New for what compostrap adds and Bootstrap 6 does not have (like the New labels of its docs)
	const badge = [
		item.new ? '<span class="badge badge-sm badge-subtle theme-success rounded-pill">New</span>' : '',
		item.badge ? `<span class="badge badge-sm badge-subtle theme-primary rounded-pill">${item.badge}</span>` : '',
	].filter(Boolean).join(' ');
	const icon = item.icon ? `<span class="list-icon"><i class="bi ${item.icon}"></i></span>` : '';
	const label = `<div class="clearfix">
	<div class="float-start">${icon}${item.title}</div>
	<div class="float-end">${badge}</div>
</div>`;

	if (item.items) {
		const open = item.items.some((child) => child.file === current);
		return `<li>
	<a class="list-link link-arrow${open ? ' link-current' : ''}">
${indent(label, 2)}
	</a>
	<ul class="list-unstyled list-hidden">
${indent(item.items.filter((child) => !child.hidden).map((child) => itemHtml(child, current)).join('\n'), 2)}
	</ul>
</li>`;
	}

	return `<li>
	<a href="${item.file}" class="list-link${item.file === current ? ' link-current' : ''}">
${indent(label, 2)}
	</a>
</li>`;
};

const menuHtml = (current) => menu.map((section) => {
	const items = section.items.map((item) => itemHtml(item, current)).join('\n');
	return `<ul class="list list-unstyled mb-0">
	<li class="list-item">
		<p class="list-title text-uppercase">${section.title}</p>
		<ul class="list-unstyled">
${indent(items, 3)}
		</ul>
	</li>
</ul>`;
}).join('\n\n');

// Dashboard › (the parent of a submenu page) › the page
const breadcrumbHtml = (page) => page.file === 'index.html'
	? '<li class="breadcrumb-item"><a class="breadcrumb-link active" aria-current="page">Dashboard</a></li>'
	: [
		'<li class="breadcrumb-item"><a class="breadcrumb-link" href="index.html">Dashboard</a></li>',
		...(page.parent ? [`<li class="breadcrumb-item"><a class="breadcrumb-link" href="${page.parent.items[0].file}">${page.parent.title}</a></li>`] : []),
		`<li class="breadcrumb-item"><a class="breadcrumb-link active" aria-current="page">${page.title}</a></li>`,
	].join('\n<li class="breadcrumb-divider" aria-hidden="true"></li>\n');

const layouts = {};
const layoutOf = (name) => (layouts[name] ??= readFileSync(name ? `demo/_layout-${name}.html` : 'demo/_layout.html', 'utf8'));
const shared = readFileSync('demo/_shared-overlays.html', 'utf8').trimEnd();
const pages = menu.flatMap((section) => section.items)
	.flatMap((item) => (item.items ? item.items.map((child) => ({ ...child, parent: item })) : [item]));

for (const page of pages) {
	const source = `demo/pages/${page.file}`;
	if (!existsSync(source)) {
		console.warn(`missing ${source}`);
		continue;
	}
	const [body, overlays = ''] = readFileSync(source, 'utf8').split(/<!-- overlays -->\r?\n/);
	// a line `<!-- content -->` ends the part of a page that stands over its content, in the whole width of the
	// window ({{hero}} of the layout)
	const [hero, content] = /<!-- content -->\r?\n/.test(body) ? body.split(/<!-- content -->\r?\n/) : ['', body];
	const html = layoutOf(page.layout)
		.replace('{{hero}}', hero.trimEnd())
		.replaceAll('{{title}}', page.title)
		.replace('{{menu}}', indent(menuHtml(page.file), 5))
		.replace('{{breadcrumb}}', indent(breadcrumbHtml(page), 6))
		.replace('{{content}}', content.trimEnd())
		.replace('{{overlays}}', overlays.trimEnd())
		.replace('{{shared-overlays}}', shared);
	writeFileSync(page.file, html);
	console.log(`${page.file}`);
}
