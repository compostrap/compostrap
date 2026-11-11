# Password toggle

[← Compostrap](../readme.md#documentation)

A button with an eye inside a password input shows the typed password and hides it again. The input and the button stand in a `.password-toggle`; the button carries `data-password-toggle`, its text for readers is the `aria-label` and `aria-pressed` says whether the password is shown. The icon follows the type of the input: an eye for a hidden password, a crossed eye for a shown one.

```html
<label class="form-label" for="password">Password</label>
<div class="password-toggle">
	<input type="password" class="form-control" id="password" autocomplete="current-password">
	<button type="button" class="password-toggle-btn" data-password-toggle aria-label="Show password" aria-pressed="false"></button>
</div>
```

```js
import { PasswordToggle } from 'compostrap/password-toggle';

PasswordToggle.init(); // once; forms loaded later by AJAX work without a new init
```

The button is shown only once the script runs, so a page without JavaScript has a plain password input. A shown password is switched back to a password input when its form is sent. A meter of the strength (`.strength`) goes under the wrapper, not inside it, and rates a shown password too. The icons are glyphs of the icon font (Bootstrap Icons, the Sass variables `$icon-eye` and `$icon-eye-slash`), so the font has to be loaded. `--password-toggle-width` and `--password-toggle-icon` set the size of the button and of the icon.
