/**
 * Charts: Chart.js in the look of the theme, written as markup, so a template can print a chart without JavaScript of
 * its own. A <canvas data-chart="{…}"> in a .chart box becomes a chart; the colors, the font, the grid and the
 * tooltip come from the tokens of the theme (--chart-1…4, --chart-muted, --chart-grid), and the charts are drawn
 * again when the theme of the page changes.
 *
 * <div class="chart" style="--chart-height: 16rem">
 *   <canvas data-chart='{"type": "area", "labels": ["1. 11.", "2. 11."], "series": [{"name": "Revenue", "data": [120, 180]}],
 *     "format": {"style": "currency", "currency": "CZK", "maximumFractionDigits": 0}}' aria-label="Revenue"></canvas>
 * </div>
 *
 * type: "area" (one series over time), "line", "bar" (columns), "bar-horizontal" (ranked bars with their values at
 * the ends), "sparkline" (a small
 * trend without axes, the last point in the accent). A series takes the next categorical color, or its own:
 * "color": 1–4 or "muted" (the gray of the context series). "format" are the options of Intl.NumberFormat for the
 * values, "locale" their language (the lang of the page by default); null is a missing value (the line ends there). Two or more series get a legend; every chart
 * gets a table of its values for screen readers.
 */
import {
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	Filler,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, Filler, LinearScale, LineController, LineElement, PointElement, Tooltip);

// a vertical hairline at the hovered position of a line or an area chart
const crosshair = {
	id: 'csCrosshair',
	afterDatasetsDraw(chart) {
		const active = chart.tooltip?.getActiveElements();
		if (!active?.length || chart.config.type !== 'line' || chart.$csSparkline) return;
		const { ctx, chartArea } = chart;
		const x = active[0].element.x;
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x, chartArea.top);
		ctx.lineTo(x, chartArea.bottom);
		ctx.lineWidth = 1;
		ctx.strokeStyle = chart.$csTheme.axis;
		ctx.stroke();
		ctx.restore();
	},
};

// the value at the end of each ranked bar, in the text color (a bar chart with one series only)
const barValues = {
	id: 'csBarValues',
	afterDatasetsDraw(chart) {
		if (!chart.$csBarValues) return;
		const { ctx } = chart;
		const meta = chart.getDatasetMeta(0);
		ctx.save();
		ctx.font = `500 14px ${chart.$csTheme.font}`;
		ctx.fillStyle = chart.$csTheme.body;
		ctx.textBaseline = 'middle';
		meta.data.forEach((bar, i) => {
			ctx.fillText(chart.$csBarValues.format(chart.data.datasets[0].data[i]), bar.x + 8, bar.y);
		});
		ctx.restore();
	},
};

export class Charts {
	static _charts = new Map();
	static _observer = null;

	/** Draws every canvas[data-chart] below the root that is not drawn yet. */
	static init(root = document) {
		root.querySelectorAll('canvas[data-chart]').forEach((canvas) => {
			if (!this._charts.has(canvas)) this.create(canvas);
		});
		if (!this._observer) {
			this._observer = new MutationObserver(() => this.refresh());
			this._observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
		}
	}

	/** Draws all charts again, e.g. after the theme changed. */
	static refresh() {
		for (const [canvas, chart] of this._charts) {
			if (!canvas.isConnected) {
				chart.destroy();
				this._charts.delete(canvas);
				continue;
			}
			chart.destroy();
			this.create(canvas);
		}
	}

	static create(canvas) {
		const config = JSON.parse(canvas.dataset.chart);
		const theme = this._theme(canvas);
		const locale = config.locale || document.documentElement.lang || undefined;
		const number = new Intl.NumberFormat(locale, config.format || {});
		const compact = new Intl.NumberFormat(locale, { ...(config.format || {}), notation: 'compact', maximumFractionDigits: 1 });
		const type = config.type || 'line';
		const sparkline = type === 'sparkline';
		const horizontal = type === 'bar-horizontal';
		const bar = type === 'bar' || horizontal;

		const datasets = config.series.map((series, i) => {
			const color = series.color === 'muted' ? theme.muted : theme.colors[((series.color || i + 1) - 1) % theme.colors.length];
			if (bar) {
				return {
					label: series.name,
					data: series.data,
					backgroundColor: color,
					hoverBackgroundColor: this._alpha(color, .8),
					borderRadius: 4,
					borderSkipped: 'start',
					maxBarThickness: 24,
					categoryPercentage: .7,
					barPercentage: .9,
				};
			}
			const last = series.data.length - 1;
			return {
				label: series.name,
				data: series.data,
				borderColor: color,
				backgroundColor: this._alpha(color, .1),
				borderWidth: sparkline ? 1.5 : 2,
				fill: type === 'area' || (sparkline && i === 0) ? 'origin' : false,
				cubicInterpolationMode: 'monotone',
				pointRadius: sparkline ? series.data.map((_, j) => (j === last ? 3 : 0)) : 0,
				pointBackgroundColor: sparkline ? theme.colors[0] : color,
				pointBorderColor: theme.surface,
				pointBorderWidth: 2,
				pointHoverRadius: sparkline ? 3 : 4,
				pointHoverBorderWidth: 2,
				pointHoverBorderColor: theme.surface,
				pointHoverBackgroundColor: color,
				borderCapStyle: 'round',
				borderJoinStyle: 'round',
			};
		});

		const valueAxis = {
			beginAtZero: true,
			border: { display: false },
			grid: { color: theme.grid, lineWidth: 1, drawTicks: false },
			ticks: { color: theme.text, font: { size: 12 }, padding: 8, maxTicksLimit: 5, callback: (value) => compact.format(value) },
		};
		const categoryAxis = {
			border: { display: false },
			grid: { display: false },
			ticks: { color: theme.text, font: { size: 12 }, maxRotation: 0, autoSkipPadding: 16, padding: 6 },
		};

		const chart = new Chart(canvas, {
			type: bar ? 'bar' : 'line',
			data: { labels: config.labels, datasets },
			plugins: [crosshair, barValues],
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: false,
				indexAxis: horizontal ? 'y' : 'x',
				layout: { padding: sparkline ? 4 : 0 },
				interaction: { mode: 'index', intersect: false, axis: horizontal ? 'y' : 'x' },
				font: { family: theme.font },
				scales: sparkline
					? { x: { display: false }, y: { display: false, beginAtZero: false } }
					: horizontal
						? { x: { ...valueAxis, grace: '32%', ticks: { ...valueAxis.ticks, display: false }, grid: { display: false } }, y: { ...categoryAxis, ticks: { ...categoryAxis.ticks, color: theme.body, font: { size: 14 } } } }
						: { x: categoryAxis, y: valueAxis },
				plugins: {
					legend: { display: false },
					tooltip: { enabled: false, external: sparkline ? undefined : (context) => this._tooltip(context, number) },
				},
			},
		});
		chart.$csTheme = theme;
		chart.$csSparkline = sparkline;
		if (horizontal && datasets.length === 1) {
			// ranked bars carry their values at their ends, so the value axis is left out
			chart.$csBarValues = number;
			chart.update();
		}
		this._charts.set(canvas, chart);

		if (!sparkline) {
			this._legend(canvas, config, datasets, bar);
		}
		this._table(canvas, config, number);
		return chart;
	}

	// the colors of the theme at the place of the canvas (a dark box inside a light page too)
	static _theme(canvas) {
		const style = getComputedStyle(canvas);
		const get = (name) => this._rgb(style.getPropertyValue(name).trim(), canvas);
		return {
			colors: [1, 2, 3, 4].map((n) => get(`--chart-${n}`)),
			muted: get('--chart-muted'),
			grid: get('--chart-grid'),
			axis: get('--chart-axis'),
			text: get('--bs-secondary-color'),
			body: get('--bs-body-color'),
			surface: get('--chart-surface'),
			font: style.getPropertyValue('--bs-body-font-family').trim(),
		};
	}

	// a canvas takes plain colors only: any CSS color (a token with color-mix too) as rgb()
	static _rgb(color, context) {
		const probe = document.createElement('span');
		probe.style.color = color;
		probe.style.display = 'none';
		context.parentElement.append(probe);
		const computed = getComputedStyle(probe).color;
		probe.remove();
		const pixel = (this._pixel ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
		pixel.clearRect(0, 0, 1, 1);
		pixel.fillStyle = computed;
		pixel.fillRect(0, 0, 1, 1);
		const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
		return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
	}

	static _alpha(color, alpha) {
		return color.replace(/rgba\((\d+), (\d+), (\d+), [\d.]+\)/, `rgba($1, $2, $3, ${alpha})`);
	}

	// the tooltip in HTML: the label of the position, then a row per series with its value first
	static _tooltip({ chart, tooltip }, number) {
		const box = chart.canvas.closest('.chart');
		let element = box.querySelector(':scope > .chart-tooltip');
		if (!element) {
			element = document.createElement('div');
			element.className = 'chart-tooltip';
			element.setAttribute('aria-hidden', 'true');
			box.append(element);
		}
		if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
			element.classList.remove('show');
			return;
		}

		element.replaceChildren();
		const title = document.createElement('div');
		title.className = 'chart-tooltip-title';
		title.textContent = tooltip.dataPoints[0].label;
		element.append(title);
		for (const point of tooltip.dataPoints) {
			if (point.raw === null || point.raw === undefined) continue;
			const row = document.createElement('div');
			row.className = 'chart-tooltip-row';
			const key = document.createElement('span');
			key.className = 'chart-key';
			key.style.setProperty('--chart-key-color', point.dataset.borderColor || point.dataset.backgroundColor);
			const value = document.createElement('strong');
			value.textContent = number.format(point.raw);
			row.append(key, value);
			if (chart.data.datasets.length > 1 || point.dataset.label) {
				const name = document.createElement('span');
				name.className = 'chart-tooltip-name';
				name.textContent = point.dataset.label;
				row.append(name);
			}
			element.append(row);
		}

		// beside the hovered position, kept inside the box
		const x = tooltip.caretX;
		const y = tooltip.caretY;
		element.classList.add('show');
		const width = element.offsetWidth;
		const left = x + 12 + width > box.clientWidth ? x - 12 - width : x + 12;
		element.style.left = `${Math.max(0, left)}px`;
		element.style.top = `${Math.max(0, Math.min(y - element.offsetHeight / 2, box.clientHeight - element.offsetHeight))}px`;
	}

	// a legend above the chart for two or more series: a line key for lines, a square for bars
	static _legend(canvas, config, datasets, bar) {
		const box = canvas.closest('.chart');
		box.previousElementSibling?.classList.contains('chart-legend') && box.previousElementSibling.remove();
		if (datasets.length < 2) return;
		const legend = document.createElement('div');
		legend.className = 'chart-legend';
		datasets.forEach((dataset) => {
			const item = document.createElement('span');
			item.className = 'chart-legend-item';
			const key = document.createElement('span');
			key.className = bar ? 'chart-key chart-key-box' : 'chart-key';
			key.style.setProperty('--chart-key-color', dataset.borderColor || dataset.backgroundColor);
			item.append(key, document.createTextNode(dataset.label));
			legend.append(item);
		});
		box.before(legend);
	}

	// the values as a table for screen readers (the canvas is only a picture)
	static _table(canvas, config, number) {
		const box = canvas.closest('.chart');
		box.querySelector(':scope > table')?.remove();
		const table = document.createElement('table');
		table.className = 'visually-hidden';
		const caption = document.createElement('caption');
		caption.textContent = canvas.getAttribute('aria-label') || '';
		const head = document.createElement('tr');
		head.append(document.createElement('th'));
		config.series.forEach((series) => {
			const th = document.createElement('th');
			th.textContent = series.name;
			head.append(th);
		});
		table.append(caption, head);
		config.labels.forEach((label, i) => {
			const tr = document.createElement('tr');
			const th = document.createElement('th');
			th.textContent = label;
			tr.append(th);
			config.series.forEach((series) => {
				const td = document.createElement('td');
				td.textContent = series.data[i] === null || series.data[i] === undefined ? '–' : number.format(series.data[i]);
				tr.append(td);
			});
			table.append(tr);
		});
		canvas.setAttribute('role', 'img');
		box.append(table);
	}
}
