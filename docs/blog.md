# Blog

[← Compostrap](../readme.md#documentation)

The module `blog` styles a website with a blog, outside the administration: a header with the links of the website, the list of articles with its categories, an article with its text and the comments under it. The page is white, the header and the footer are tinted bars and the boxes (cards of articles, comments, the comment form) are tinted instead of framed (`--blog-page-bg`, `--blog-tint-bg`, `--blog-tint-hover-bg`). The header holds a navbar of Bootstrap, so the links fold into a menu on a phone.

```html
<body class="blog-page">
	<header class="blog-header">
		<nav class="navbar navbar-expand-lg">
			<div class="container">
				<a class="blog-brand" href="/">Logo <span>Name</span></a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#blog-menu" aria-controls="blog-menu" aria-expanded="false" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>
				<div class="collapse navbar-collapse" id="blog-menu">
					<ul class="navbar-nav ms-auto"><li class="nav-item"><a class="nav-link active" href="/blog">Blog</a></li></ul>
					<div class="blog-header-actions"><a class="btn btn-primary btn-sm" href="/sign-in">Sign in</a></div>
				</div>
			</div>
		</nav>
	</header>
	<main class="container">…</main>
	<footer class="blog-footer">
		<div class="container">
			<div class="row g-4">
				<div class="col-lg-4">…</div>
				<div class="col-6 col-md-4 col-lg-2"><h2 class="blog-footer-title">Links</h2><ul class="blog-footer-links"><li><a href="/blog">Blog</a></li></ul></div>
			</div>
		</div>
	</footer>
</body>
```

**List of articles.**

- `.blog-title` is the heading of a page; `.blog-heading` puts a link on its right.
- `nav.blog-pills` holds the categories as links `.blog-pill`, the chosen one with `active`.
- `article.blog-featured` is the newest article over the whole row: a picture in `.blog-featured-image` next to `.blog-featured-body`.
- `article.blog-card` are the other articles, in a Bootstrap grid (`row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4`).
- `.blog-card-title` holds the link of the whole block (`stretched-link`); other links in the block get `.blog-over`.
- `.blog-meta` is a line of date, category and comments parted by dots.
- `.blog-author` is an `avatar` of the theme with the name (`.blog-author-name`).

```html
<article class="blog-card">
	<div class="blog-card-image"><img src="…" alt="" loading="lazy"></div>
	<div class="blog-meta"><time datetime="2026-11-05">5 days ago</time><a class="blog-over" href="/blog/latte">Latte</a></div>
	<h2 class="blog-card-title"><a class="stretched-link" href="/blog/article">Title</a></h2>
	<p class="blog-card-text">Perex, cut after three lines.</p>
	<div class="blog-card-footer">
		<div class="blog-author"><span class="avatar avatar-sm theme-success">PK</span><span>Petra Králová</span></div>
		<a class="blog-over" href="/blog/article#comments">Comments: 5</a>
	</div>
</article>
```

**Article.** `article.blog-article` is a narrow column (`--blog-article-width`, 48rem) with:

- `.blog-back`, a link back,
- `.blog-article-title` and the perex `.blog-article-lead`,
- `.blog-meta.blog-article-meta` with the author, the date and the category,
- `.blog-article-image`, the cover (a 21 : 9 cut),
- `.blog-content`, the text: 16px text with more room between lines, headings, lists, pictures as wide cuts, a quote with a line of the primary color and code blocks on the tint.

A highlighted code is written with the text classes of Bootstrap; in a code block they take the colors of the code on nette.org, which can be changed by a variable (each as `r, g, b`):

| Class | Part of the code | Variable |
|-------|------------------|----------|
| `text-primary` | keyword and tag | `--blog-code-keyword` |
| `text-primary-emphasis` | name of a function or method | `--blog-code-function` |
| `text-success` | string | `--blog-code-string` |
| `text-danger` | number | `--blog-code-number` |
| `text-warning-emphasis` | variable | `--blog-code-variable` |
| `text-info-emphasis` | attribute | `--blog-code-attribute` |
| `text-danger-emphasis` | Latte tag | `--blog-code-macro` |
| `text-body-secondary` | comment | `--blog-code-comment` |

The box of a code is `--blog-code-bg`.

**Comments.** `section.blog-comments` with `.blog-comments-title`; a comment is `article.blog-comment` with:

- `.blog-comment-head`: the avatar, `.blog-comment-author`, the link of its number and the time,
- `.blog-comment-content`: the text of a comment, which holds only the message,
- `.blog-meta.blog-comment-foot`: Reply and, in a comment that answers another one, the link to it as "In reply to".

A comment opened by its link (`#comment-2`) is stronger and stays under the sticky header. The form of a new comment stands in `.blog-comment-form` with its title `.blog-comment-form-title` over the box.
