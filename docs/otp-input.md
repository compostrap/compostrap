# OTP input

[← Compostrap](../readme.md#documentation)

A one-time code (a verification code from an e-mail or an SMS, a PIN) typed into separate slots, with the markup, options, methods and events of the OTP input of Bootstrap 6, so the markup stays when a project moves to it. One real input holds the value: a form sends it as any other field, a screen reader reads one field, a password manager and the autofill of a code from an SMS (`autocomplete="one-time-code"`) fill it. The script draws a slot for each character and lays the transparent input over them. The number of slots is the `maxlength` of the input (6 without it).

```html
<label class="form-label" for="code">Verification code</label>
<div class="otp" data-bs-otp>
	<input type="text" class="otp-input" id="code" name="code" maxlength="6" aria-describedby="code-help">
</div>
<div class="form-text" id="code-help">Enter the 6-digit code sent to your phone.</div>
```

An input without a label needs `aria-label`.

| Class | What it does |
|-------|--------------|
| `otp-connected` | the slots share their borders, one field |
| `otp-sm`, `otp-lg` | 36px and 52px slots (44px by default) |
| `otp-fill` | the slots share the whole width of the wrapper, e.g. in a narrow sign-in form (not in Bootstrap 6) |
| `is-valid`, `is-invalid` | the state of the validation, on the wrapper; on the input (as a form renderer writes it) it works too, a `valid-feedback`/`invalid-feedback` after the wrapper shows |

| Attribute of the wrapper | Default | What it does |
|--------------------------|---------|--------------|
| `data-bs-length` | `maxlength` of the input, or 6 | the number of slots |
| `data-bs-type` | `numeric` | `numeric`, `alphanumeric` or `alpha`: the characters that are let in (and the keyboard of a phone) |
| `data-bs-mask` | `false` | `true` shows `•` in the slots; the value stays |
| `data-bs-groups` | – | the sizes of the groups, e.g. `[3,3]`; a separator stands between them, the last size repeats |
| `data-bs-separator` | `·` | the text of the separator |

A typed character replaces the one of its slot and the caret goes to the next slot; Backspace and Delete remove a character, the arrows move, a click chooses a slot (never past the first empty one). A pasted code is cleaned first (`123 456` fills six slots), a whole code replaces what was there.

```js
import { OtpInput } from 'compostrap/otp-input';

OtpInput.init(); // once; a code loaded later by AJAX works from its first focus
OtpInput.update(snippet); // draws the slots of a redrawn part at once

const otp = OtpInput.getOrCreateInstance(document.querySelector('.otp'));
otp.getValue();
otp.setValue('123456');
otp.clear();
otp.focus();
otp.dispose();

element.addEventListener('complete.bs.otpInput', (event) => form.requestSubmit()); // event.value is the code
```

The wrapper fires `input.bs.otpInput` after every change and `complete.bs.otpInput` when all slots are filled, both with the code in `event.value` (and `event.detail.value`). The options can be passed as the second argument of `new OtpInput(element, { length, type, mask, groups, separator })` too.

The variables of the wrapper tune the look: `--otp-size`, `--otp-font-size`, `--otp-gap`, `--otp-slot-fg`, `--otp-slot-bg`, `--otp-slot-border-width`, `--otp-slot-border-color` and `--otp-slot-border-radius`. A slot has the look of a form control; the slot at the caret takes the focus of a text field and blinks a caret while it is empty.
