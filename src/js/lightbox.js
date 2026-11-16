/**
 * Lightbox: a link with data-lightbox opens its image (href) in a full-screen preview; links with the same value of
 * data-lightbox form a group to browse by the arrows, the keys ← → and a swipe. data-caption gives the text under the
 * image. Built on the native <dialog>, so Esc closes it and the focus returns to the link. The links are found on
 * every click, so content loaded later (AJAX snippets) needs no new init(). An image linked twice in a group (a big
 * photo over its thumbnails) is shown once, at the place of its last link.
 *
 * <a href="photo-large.jpg" data-lightbox="gallery" data-caption="photo.jpg">…</a>
 */
const icons = {
	close: '<path d="M6 6l12 12M18 6L6 18"/>',
	previous: '<path d="M15 5l-7 7 7 7"/>',
	next: '<path d="M9 5l7 7-7 7"/>',
};

const icon = (name) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
	stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

export class Lightbox {
	static labels = {
		dialog: 'Image preview',
		close: 'Close',
		previous: 'Previous',
		next: 'Next',
	};

	static _dialog = null;
	static _links = [];
	static _index = 0;
	static _initialized = false;

	static init(labels = {}) {
		this.labels = { ...this.labels, ...labels };
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		document.addEventListener('click', (event) => {
			const link = event.target.closest('[data-lightbox]');
			if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) {
				return;
			}

			event.preventDefault();
			const group = link.dataset.lightbox;
			const address = (item) => item.getAttribute('href');
			const links = group
				? [...document.querySelectorAll('[data-lightbox]')].filter((item) => item.dataset.lightbox === group)
				: [link];
			// an image linked twice (a big photo over its thumbnails) is shown once, at the place of its last link
			this._links = links.filter((item, index) => !links.slice(index + 1).some((later) => address(later) === address(item)));
			this.open(Math.max(0, this._links.findIndex((item) => address(item) === address(link))));
		});
	}

	static open(index) {
		const dialog = this._getDialog();
		this._setLabels(dialog);
		dialog.classList.toggle('lightbox-single', this._links.length < 2);
		this._show(index);
		if (!dialog.open) {
			const root = document.documentElement;
			// the room of a classic scrollbar is kept while the page is locked, so nothing shifts; a page without one
			// (short, or an overlay scrollbar) gets no empty strip
			const gutter = window.innerWidth - root.clientWidth;
			root.classList.toggle('lightbox-gutter', gutter > 0);
			root.style.setProperty('--lightbox-gutter', `${Math.max(gutter, 0)}px`);
			root.classList.add('lightbox-open');
			dialog.showModal();
		}
	}

	static close() {
		this._dialog?.close();
	}

	static _show(index) {
		const count = this._links.length;
		this._index = (index + count) % count;
		const link = this._links[this._index];
		const dialog = this._dialog;
		const image = dialog.querySelector('.lightbox-image');
		const caption = dialog.querySelector('.lightbox-caption');

		image.src = link.getAttribute('href');
		image.alt = link.dataset.caption || link.getAttribute('aria-label') || '';
		caption.textContent = link.dataset.caption || '';
		dialog.querySelector('.lightbox-counter').textContent = count > 1 ? `${this._index + 1} / ${count}` : '';

		// the neighbours are loaded ahead, so browsing does not wait
		[this._index - 1, this._index + 1].forEach((i) => {
			const next = this._links[(i + count) % count];
			if (next && next !== link) {
				new Image().src = next.getAttribute('href');
			}
		});
	}

	// on every opening, so labels given by a later init() reach a dialog that already exists
	static _setLabels(dialog) {
		dialog.setAttribute('aria-label', this.labels.dialog);
		dialog.querySelector('.lightbox-close').setAttribute('aria-label', this.labels.close);
		dialog.querySelector('.lightbox-prev').setAttribute('aria-label', this.labels.previous);
		dialog.querySelector('.lightbox-next').setAttribute('aria-label', this.labels.next);
	}

	static _getDialog() {
		if (this._dialog) {
			return this._dialog;
		}

		const dialog = document.createElement('dialog');
		dialog.className = 'lightbox';
		// the markup is fixed; the labels are texts of a project (translations), so they are set as attributes
		// in _setLabels(), never written into the HTML
		dialog.innerHTML = `
			<figure class="lightbox-figure">
				<img class="lightbox-image" alt="">
				<figcaption class="lightbox-caption"></figcaption>
			</figure>
			<div class="lightbox-counter" aria-live="polite"></div>
			<button type="button" class="lightbox-button lightbox-close">${icon('close')}</button>
			<button type="button" class="lightbox-button lightbox-prev">${icon('previous')}</button>
			<button type="button" class="lightbox-button lightbox-next">${icon('next')}</button>`;

		dialog.querySelector('.lightbox-close').addEventListener('click', () => this.close());
		dialog.querySelector('.lightbox-prev').addEventListener('click', () => this._show(this._index - 1));
		dialog.querySelector('.lightbox-next').addEventListener('click', () => this._show(this._index + 1));

		// a click beside the image closes the preview
		dialog.addEventListener('click', (event) => {
			if (event.target === dialog || event.target.classList.contains('lightbox-figure')) {
				this.close();
			}
		});

		dialog.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') {
				this._show(this._index - 1);
			} else if (event.key === 'ArrowRight') {
				this._show(this._index + 1);
			}
		});

		let touchX = null;
		dialog.addEventListener('touchstart', (event) => {
			touchX = event.touches[0].clientX;
		}, { passive: true });
		dialog.addEventListener('touchend', (event) => {
			if (touchX === null || this._links.length < 2) {
				return;
			}

			const distance = event.changedTouches[0].clientX - touchX;
			touchX = null;
			if (Math.abs(distance) > 50) {
				this._show(this._index + (distance < 0 ? 1 : -1));
			}
		});

		dialog.addEventListener('close', () => {
			document.documentElement.classList.remove('lightbox-open', 'lightbox-gutter');
			document.documentElement.style.removeProperty('--lightbox-gutter');
			dialog.querySelector('.lightbox-image').removeAttribute('src');
		});

		document.body.append(dialog);
		this._dialog = dialog;
		return dialog;
	}
}
