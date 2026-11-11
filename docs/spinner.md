# Spinner

[← Compostrap](../readme.md#documentation)

A spinner shows that a request runs, for example an AJAX request of the page. It has two forms:

- `.spinner`: a thin line at the top of the window with a piece that runs from left to right. The page stays in use.
- `.spinner-overlay`: the whole window darkens and a ring turns in its middle. It lies over everything, so nothing can be clicked until the request ends.

```html
<div class="spinner" role="status" aria-label="Loading"></div>

<div class="spinner-overlay" role="status" aria-label="Loading"></div>
```

The element stands at the end of `<body>` only while the request runs. The script adds and removes it:

```js
import { Spinner } from 'compostrap/spinner';

const spinner = new Spinner();                  // the line at the top
const spinner = new Spinner({ overlay: true }); // the dark overlay

spinner.show();
fetch(url).finally(() => spinner.hide());
```

`show()` and `hide()` are counted: with more requests at once the spinner stays until the last one ends. `spinner.active` says whether a request runs. The overlay also stops the keys Tab, Enter and Space, so a focused button cannot send a form once more, and gives the focus back when it ends. The options are `overlay` (false), `label` (the `aria-label`, "Loading") and `parent` (`document.body`).

With Naja, show the spinner on its `start` event and hide it on `complete`:

```js
naja.addEventListener('start', () => spinner.show());
naja.addEventListener('complete', () => spinner.hide());
```

A single box that loads does not need a spinner of the window: see the loading state `aria-busy` of [elements](elements.md).

## Variables

| Variable | Form | Default | Meaning |
|----------|------|---------|---------|
| `--spinner-zindex` | both | `9999` | the layer, over modals and offcanvases |
| `--spinner-color` | both | `var(--bs-primary)`, overlay `#fff` | the color of the running piece or of the ring |
| `--spinner-duration` | both | `1.5s`, overlay `.7s` | the time of one run or turn |
| `--spinner-height` | line | `.2rem` | the height of the line |
| `--spinner-width` | line | `15rem` | the width of the running piece |
| `--spinner-overlay-bg` | overlay | `rgba(0, 0, 0, .5)` | the color over the page |
| `--spinner-size` | overlay | `3rem` | the size of the ring |
| `--spinner-border-width` | overlay | `3px` | the width of the ring |
| `--spinner-track-color` | overlay | `rgba(255, 255, 255, .25)` | the color of the rest of the ring |
