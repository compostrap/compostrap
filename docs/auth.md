# Sign-in pages

[← Compostrap](../readme.md#documentation)

The module `auth` lays out a page outside the administration: the brand and the theme switch above a box in the middle, a footer under it. The box is narrow; `auth-card-split` makes it wide with a visual on the left from large screens (the visual is hidden on smaller ones). A one-time code (the recovery of a password) is typed into the slots of the module [`otp-input`](otp-input.md).

```html
<body class="auth-page">
	<div class="auth">
		<div class="auth-top"><a class="auth-brand" href="/">Logo Name</a> <div class="auth-actions">(theme switch, language dropdown)</div></div>
		<div class="auth-card auth-card-split">
			<aside class="auth-visual" aria-hidden="true"><i class="bi bi-shield-lock"></i></aside>
			<main class="auth-body">
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
