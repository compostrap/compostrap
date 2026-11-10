/**
 * The script of a dropzone (.dropzone with a .dropzone-input): highlights the area while files are dragged over it
 * (class is-dragover), writes the names of the chosen files into [data-dropzone-files] and, with the attribute
 * data-dropzone-submit on the input, submits its form at once (an AJAX form of Naja catches the submit event).
 * Call init() again after new content is loaded, a dropzone is bound only once.
 */
export class DropzoneInput {
	static init(root = document) {
		root.querySelectorAll('.dropzone').forEach((zone) => {
			const input = zone.querySelector('.dropzone-input');
			if (!input || zone.dataset.dropzoneInitialized === 'true') {
				return;
			}

			zone.dataset.dropzoneInitialized = 'true';
			const files = zone.querySelector('[data-dropzone-files]');
			const highlight = (on) => zone.classList.toggle('is-dragover', on);

			input.addEventListener('dragenter', () => highlight(true));
			input.addEventListener('dragover', () => highlight(true));
			input.addEventListener('dragleave', () => highlight(false));
			input.addEventListener('drop', () => highlight(false));

			input.addEventListener('change', () => {
				if (files) {
					files.textContent = [...input.files].map((file) => file.name).join(', ');
				}

				if (input.files.length > 0 && input.hasAttribute('data-dropzone-submit') && input.form) {
					input.form.requestSubmit();
				}
			});
		});
	}
}
