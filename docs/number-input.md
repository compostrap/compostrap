# Number input

[← Compostrap](../readme.md#documentation)

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
