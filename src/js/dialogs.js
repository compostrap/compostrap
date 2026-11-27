/**
 * Dialogs: a modal and an offcanvas of Bootstrap are not closed by a click outside of them, so a form in one is
 * not lost by a slip of the mouse; they are closed by their cross, their Cancel button (data-bs-dismiss) and Esc.
 * It changes the default `backdrop` option of Bootstrap to 'static', so it holds for every dialog created after
 * init(), also for those loaded later (AJAX snippets) or opened from a script.
 *
 * A dialog that should close by a click outside says so itself (a search, a menu):
 *
 * <div class="modal fade" data-bs-backdrop="true">…</div>
 *
 * Dialogs.init() takes Bootstrap from `window.bootstrap`; a project that imports it as a module passes it:
 *
 * import { Modal, Offcanvas } from 'bootstrap';
 * Dialogs.init({ Modal, Offcanvas });
 */
export class Dialogs {
	static init(bootstrap = globalThis.bootstrap) {
		for (const component of [bootstrap?.Modal, bootstrap?.Offcanvas]) {
			// Default is the object every new instance takes its options from
			if (component?.Default) {
				component.Default.backdrop = 'static';
			}
		}

		// one function, so a second init() adds no second listener
		document.addEventListener('hidePrevented.bs.offcanvas', focusOffcanvas);
	}
}

/**
 * A click on the static backdrop leaves the focus outside of an offcanvas, where Esc does not reach it; a modal
 * takes the focus back itself (twbs/bootstrap#37155, fixed only by the dialog of Bootstrap 6). The backdrop calls
 * on mousedown, before the browser moves the focus to the body, so the focus is returned after it.
 */
function focusOffcanvas(event) {
	setTimeout(() => event.target.focus());
}
