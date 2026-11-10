/**
 * Datepicker: a calendar of Vanilla Calendar Pro under an input with data-bs-toggle="datepicker", configured like the
 * datepicker of Bootstrap 6 (the same data attributes). The value of the input is an ISO date (2026-11-07), which a
 * server understands; data-bs-date-format="locale" writes it in the language of the page instead (for display only).
 * A choice fires input and change on the input. An element with data-bs-inline="true" shows the calendar in the page,
 * with an <input type="hidden"> inside for the value.
 *
 * Attributes: data-bs-date-min, data-bs-date-max (ISO dates or "today"), data-bs-selection-mode ("single", "multiple",
 * "multiple-ranged"), data-bs-display-months-count, data-bs-first-weekday (1 = Monday), data-bs-locale (the lang of the
 * page by default), data-bs-date-format ("iso" or "locale"), data-bs-inline.
 *
 * <input type="text" class="form-control" data-bs-toggle="datepicker" data-bs-date-min="today" autocomplete="off">
 */
import { Calendar, months } from 'vanilla-calendar-pro';

const SELECTOR = '[data-bs-toggle="datepicker"]';

export class Datepicker {
	static options = {
		firstWeekday: 1,
		locale: null,
		dateFormat: 'iso',
	};

	static _calendars = new WeakMap();
	static _initialized = false;

	/** Starts the datepickers; the options are defaults for all of them, the data attributes of an input win. */
	static init(options = {}) {
		this.options = { ...this.options, ...options };
		document.querySelectorAll(`${SELECTOR}[data-bs-inline="true"]`).forEach((element) => this.get(element));
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		document.addEventListener('focusin', (event) => {
			const input = event.target.closest?.(SELECTOR);
			// the first focus creates the calendar and opens it, later ones are opened by the calendar itself (it
			// knows when the focus only returns to the input after a choice)
			if (input && input.tagName === 'INPUT' && !input.disabled && !input.readOnly && !this._calendars.has(input)) {
				this.get(input).show();
			}
		});
		// a focus or a press outside closes the calendar (Vanilla Calendar Pro closes it on a click only)
		const outside = (event) => {
			document.querySelectorAll('[data-vc="calendar"][data-vc-input]:not([data-vc-calendar-hidden])').forEach((element) => {
				const input = element.__compostrapInput;
				if (input && !input.contains(event.target) && !element.contains(event.target)) {
					this._calendars.get(input)?.hide();
				}
			});
		};
		document.addEventListener('focusin', outside);
		document.addEventListener('pointerdown', outside);
	}

	/** The calendar of an input (or of an inline element), created on first use. */
	static get(element) {
		let calendar = this._calendars.get(element);
		if (!calendar) {
			calendar = this._create(element);
			this._calendars.set(element, calendar);
		}

		return calendar;
	}

	static _create(element) {
		const data = element.dataset;
		const inline = data.bsInline === 'true';
		const input = element.tagName === 'INPUT' ? element : element.querySelector('input');
		const mode = data.bsSelectionMode || 'single';
		const format = data.bsDateFormat || this.options.dateFormat;
		const locale = data.bsLocale || this.options.locale || document.documentElement.lang || 'default';
		const count = Number(data.bsDisplayMonthsCount) || 1;
		const selected = this._parse(input?.dataset.bsValue || input?.value || '');

		const calendar = new Calendar(element, {
			extensions: [months],
			inputMode: !inline,
			openOnFocus: true,
			positionToInput: 'left',
			firstWeekday: Number(data.bsFirstWeekday ?? this.options.firstWeekday),
			locale,
			selectionDatesMode: mode,
			selectedDates: selected,
			displayMonthsCount: count,
			type: count > 1 ? 'multiple' : 'default',
			themeAttrDetect: 'html[data-bs-theme]',
			...(selected[0] ? { selectedMonth: Number(selected[0].slice(5, 7)) - 1, selectedYear: Number(selected[0].slice(0, 4)) } : {}),
			...(data.bsDateMin ? { dateMin: data.bsDateMin } : {}),
			...(data.bsDateMax ? { dateMax: data.bsDateMax } : {}),
			onInit: (self) => {
				self.context.mainElement.__compostrapInput = element;
			},
			onClickDate: (self) => {
				const dates = [...self.context.selectedDates];
				if (input) {
					input.dataset.bsValue = dates.join(',');
					input.value = this._format(dates, mode, format, locale);
					input.dispatchEvent(new Event('input', { bubbles: true }));
					input.dispatchEvent(new Event('change', { bubbles: true }));
				}
				if (!inline && ((mode === 'single' && dates.length) || (mode === 'multiple-ranged' && dates.length > 1))) {
					setTimeout(() => self.hide(), 100);
				}
			},
		});
		calendar.init();
		return calendar;
	}

	// ISO dates of a value: "2026-11-07", "2026-11-07,2026-11-09" or "2026-11-07 – 2026-11-09"
	static _parse(value) {
		return value.match(/\d{4}-\d{2}-\d{2}/g) || [];
	}

	static _format(dates, mode, format, locale) {
		const text = (date) => {
			if (format !== 'locale') return date;
			const [y, m, d] = date.split('-').map(Number);
			return new Date(y, m - 1, d).toLocaleDateString(locale === 'default' ? undefined : locale);
		};
		return dates.map(text).join(mode === 'multiple-ranged' ? ' – ' : ', ');
	}
}
