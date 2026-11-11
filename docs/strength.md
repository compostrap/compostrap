# Password strength

[← Compostrap](../readme.md#documentation)

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
