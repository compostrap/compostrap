# Charts

[← Compostrap](../readme.md#documentation)

Charts of [Chart.js](https://www.chartjs.org) written as markup, so a template prints a chart without JavaScript of its own: a `<canvas data-chart>` in a `.chart` box with the data as JSON.

- The colors, the font, the grid and the tooltip come from the theme, and the charts are drawn again when the light or dark theme changes.
- The four categorical colors (`--chart-1` … `--chart-4`: blue, orange, purple, green) are checked for color blindness and contrast on the surfaces of both themes; a series of context takes the gray `--chart-muted`.
- Two or more series get a legend.
- A tooltip shows every series at the hovered position.
- Every chart gets a table of its values for screen readers.

```html
<div class="chart" style="--chart-height: 16rem">
	<canvas aria-label="Revenue of the last 30 days" data-chart='{
		"type": "area",
		"labels": ["9. 10.", "10. 10.", "11. 10."],
		"series": [{"name": "Revenue", "data": [32400, 30100, 21800]}],
		"format": {"style": "currency", "currency": "USD", "maximumFractionDigits": 0},
		"locale": "en-US"
	}'></canvas>
</div>
```

| Type | For |
|------|-----|
| `area` | one series over time: a line with a light wash under it |
| `line` | series over time; `"color": "muted"` makes a series the gray context of the highlighted one |
| `bar` | columns, e.g. orders per day |
| `bar-horizontal` | ranked bars of a part-to-whole (the largest first), their values at the ends |
| `sparkline` | a small trend in a stat tile (`.chart.chart-sparkline`), the last point in the accent |

A series takes the next color, or its own `"color": 1`–`4` or `"muted"`; `null` is a missing value. `format` are the options of `Intl.NumberFormat`, `locale` their language (the `lang` of the page by default).

```js
import { Charts } from 'compostrap/chart'; // needs chart.js

Charts.init(); // draws every canvas[data-chart]; call it again (or Charts.init(snippet)) for charts loaded by AJAX
```
