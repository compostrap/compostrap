# Shop

[← Compostrap](../readme.md#documentation)

The module `shop` styles the storefront of an e-shop, outside the administration: a header with a mini cart, a product list and detail, the cart, the steps of the order and the summary of prices. The page is a column with a header, a `main` and a footer, so a short page keeps the footer at the bottom. The surfaces are white boxes (`.card`) on the page color, darker in the dark theme; there are no borders. The amount of an item is the `number-input` module.

The mini cart of the header (`a.shop-minicart`) shows the count of pieces in a badge over the icon and the price next to it: the shop prints the number, `99+` over 99 pieces and nothing for an empty cart (the empty badge is not shown, it stays in the page as the `aria-live` region); a wider count moves the price, it does not cover it.

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

**Welcome band.** A low band right under the header, in the whole width of the window and tinted with the primary color (the header drops its gap, the band has it under itself): a title in two tones (`.shop-hero-title`, its `<em>` is the second one), a short text and a row of white icons of products on round chips that grow stronger towards the edge; a label over the title (`.shop-hero-eyebrow`) is optional. The icons are left out below 768px. The size of a chip is `--shop-hero-icon-size`.

```html
<header class="shop-header">…</header>
<section class="shop-hero">
	<div class="container">
		<div class="shop-hero-copy">
			<p class="shop-hero-title">Your shopping, <em>simply.</em></p>
			<p class="shop-hero-text">Browse the offer, put products into the cart and finish the order in a few easy steps.</p>
		</div>
		<div class="shop-hero-art" aria-hidden="true">
			<span class="shop-hero-icon"><i class="bi bi-headphones"></i></span>
			<span class="shop-hero-icon"><i class="bi bi-laptop"></i></span>
		</div>
	</div>
</section>
<main class="container">…</main>
```

**Product list.** Over the list, a box `.shop-toolbar` holds the chosen filters and the order:

- `.shop-filter-chips` are the chosen filters.
- `nav.shop-sort` under them holds the links of the order (recommended, bestsellers, cheapest…) as `nav nav-tabs` in one row that scrolls on a phone. In the box the tabs have no frames and the current one has a line under it, on the bottom edge of the box.
- The page needs no visible heading then, its `h1` can be `visually-hidden`.

A tile is an `article.shop-product` with an image and a body:

- `.shop-product-image` is the image, with a `badge` of the discount in `.shop-product-badge`.
- `.shop-product-rating` is a `rating-static rating-sm`, the value and a link with the count of reviews. Without a rating the row gets `.shop-product-rating-empty`: empty stars with `--rating-value: 0` and a quiet text; two tiles in a row on a phone show only the text.
- `.shop-product-title` is the title.
- `.shop-product-text` is the text, cut after four lines below 768px (`--shop-product-text-lines`).
- `.shop-product-footer` holds the row `.shop-product-buy` and the availability under it.
- `.shop-product-buy` is a tinted strip with the prices in `.shop-product-prices` and a small button on the right. The price is `.shop-price`, with the original one in `.shop-price-old` under it or a word such as "from" over it.
- `.shop-stock` is the availability in the middle under the strip, a text with a color class: `text-success` in stock, `text-danger` out of stock.

Tiles go into a Bootstrap grid (`col-6 col-md-4 col-lg-6 col-xl-4 col-xxl-3` next to the filters, `col-xl-3` without them).

**Filters.**

- `.shop-catalog` puts the filters into a column next to the list (`--shop-filters-width`, from lg up).
- Below lg they are a panel: the wrapper is the responsive offcanvas of Bootstrap (`offcanvas-lg offcanvas-start`), opened by a button with `data-bs-toggle="offcanvas"`.
- `form.shop-filters` inside holds groups `fieldset.shop-filter` with a `legend.shop-filter-title` and plain `form-check` choices (the count of products in `.shop-filter-count`).
- `.shop-filter-range` is a row of two fields (price from – to).
- `.shop-filter-chips` shows the chosen filters over the list as links `.shop-filter-chip`; a click removes one.

**Product detail.** The photos and the text with the choice of a variant stand side by side in one box (a `card` with a `row` inside).

- `.shop-detail-gallery` holds the photos (no surface of its own): a big `img.shop-detail-main` and `.shop-detail-thumbs` of `.shop-detail-thumb` buttons or links (the shown one has `active`).
- The big photo opens in the [lightbox](lightbox.md) when it stands in a link `a.shop-detail-zoom` with `data-lightbox`. With the thumbnails as links of the same group (`<a href="photo.jpg" class="shop-detail-thumb" data-lightbox="product">`) the lightbox browses all the photos and opens at the shown one; the script of the project that shows a thumbnail in the big photo prevents the click, so a thumbnail does not open the lightbox itself.
- `.shop-variant-group` is a choice of a variant, with a `.shop-variant-title` and `.shop-variant-options` of `button.shop-variant-pill`: the chosen one has `active`, an unavailable combination is `disabled`.
- Switching the variants and the photos is up to the project.

**Reviews.** On the detail, `.shop-reviews-summary` shows the average next to the shares of the grades:

- `.shop-reviews-score` is the average: `.shop-reviews-value`, a `rating-static` and the count.
- `ul.shop-reviews-bars` are the shares of the grades, a row per grade with a `.shop-reviews-bar` filled by `--shop-reviews-share`.

A review is an `article.shop-review`:

- `.shop-review-header`: an `avatar`, `.shop-review-author` with the name and the date, a `rating-static rating-sm`,
- the text,
- `.shop-review-points` with the lists `.shop-review-pros` and `.shop-review-cons` (a green plus and a red minus before each item),
- `.shop-review-footer` with the buttons of a helpful review.

The rating row of a tile (`.shop-product-rating`) is used under the name of the product too, its link leads to the reviews.

**Steps of the order.** A step of the order starts with `header.shop-checkout-head`, one bar from lg up:

- The title of the page (`h1`) stands in its left third, the steps in the other two thirds (5 : 7 between lg and xl), so they stay in place whatever the length of the title.
- Below lg the steps go under the title.
- Where the steps have little room, only the current one keeps its name; on phones too.

The steps are an `ol.shop-stepper` of `li.shop-stepper-item`:

- `.shop-stepper-badge` is the number, or a check icon in a done step.
- `.shop-stepper-label` is the name of the step.
- `.shop-stepper-line` joins it with the next one.
- `is-done` marks a step already passed (its badge is a link back), `is-current` the present one.

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

**Facts of an order.** `dl.shop-info` shows the facts to read (the customer, the address, the carrier and the payment in the summary and the confirmation): each pair is a `div` with a `dt` (a quiet label) over a `dd` (the value), side by side as many as fit. An address inside is an `address.shop-address`, written as on a parcel: the name in a `strong` on its own line, then the street, the town and the country.

**Confirmation of an order.** `.shop-confirm` (with `theme-success`) is the banner after the order is placed, in the tint of a subtle success badge: `.shop-confirm-icon` (a check in a green circle) on the left, next to it `.shop-confirm-title` in the green of the text and a text with the number of the order. Under it go the ordered items (`.shop-cart-item` rows without the amount control), the delivery and the `.shop-summary`; all steps of the stepper are `is-done`.
