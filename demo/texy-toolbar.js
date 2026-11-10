// Demo only: the toolbar that drago-ex/texy-toolbar builds over a textarea with `data-texy-toolbar`, with the same
// markup and classes of Bootstrap, so the pages show how it looks in the theme. The buttons insert the marks of Texy;
// the preview (the server makes it in drago) only shows the written text here. The attribute may hold JSON with the
// shown buttons: data-texy-toolbar='{"buttons": ["bold", "italic", "link", "list", "numbered", "quote", "code"]}'.

const icon = (paths) => '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"'
	+ ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';

const buttons = [
	{ name: 'bold', label: 'Bold', content: '<span class="fw-bold">B</span>', wrap: ['**', '**'] },
	{ name: 'italic', label: 'Italic', content: '<span class="fst-italic font-monospace">I</span>', wrap: ['*', '*'] },
	{ name: 'heading', label: 'Heading', content: '<span class="fw-bold">H</span>', line: '### ' },
	{ name: 'list', label: 'List', content: icon('<path d="M6 4h8M6 8h8M6 12h8"/><circle cx="2.5" cy="4" r=".5"/><circle cx="2.5" cy="8" r=".5"/><circle cx="2.5" cy="12" r=".5"/>'), line: '- ' },
	{ name: 'numbered', label: 'Numbered list', content: icon('<path d="M6 4h8M6 8h8M6 12h8M2 2.5h1v3M2 9.5h2l-2 2.5h2"/>'), line: '1) ' },
	{ name: 'quote', label: 'Quote', content: icon('<path d="M3 12c0-3.5 1-5.5 3-7M9 12c0-3.5 1-5.5 3-7"/>'), line: '> ' },
	{ name: 'link', label: 'Link', content: icon('<path d="M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1a2.5 2.5 0 0 1-3.5-3.5l1-1"/>'), wrap: ['"', '":https://'] },
	{ name: 'image', label: 'Image', content: icon('<rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M1.5 11l4-4 3 3 2-2 4 4"/><circle cx="11" cy="5.5" r="1"/>'), wrap: ['[* ', ' *]'] },
];

const languages = ['php', 'neon', 'latte', 'sql', 'css', 'js'];

function insert(textarea, before, after = '') {
	const { selectionStart: start, selectionEnd: end, value } = textarea;
	textarea.focus();
	textarea.setRangeText(before + value.slice(start, end) + after, start, end, 'select');
	textarea.setSelectionRange(start + before.length, end + before.length);
}

function createToolbar(textarea) {
	const options = textarea.dataset.texyToolbar ? JSON.parse(textarea.dataset.texyToolbar) : {};
	const shown = (name) => !options.buttons || options.buttons.includes(name);
	const controls = [];

	const toolbar = document.createElement('div');
	toolbar.className = 'd-flex flex-wrap align-items-center gap-1 mb-2';

	for (const { name, label, content, wrap, line } of buttons.filter((button) => shown(button.name))) {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'btn btn-sm btn-secondary lh-1';
		button.style.minWidth = '2rem';
		button.title = label;
		button.setAttribute('aria-label', label);
		button.innerHTML = content;
		button.addEventListener('click', () => (wrap ? insert(textarea, ...wrap) : insert(textarea, line)));
		controls.push(button);
	}

	if (shown('code')) {
		const code = document.createElement('select');
		code.className = 'form-select form-select-sm w-auto';
		code.setAttribute('aria-label', 'Code');
		code.add(new Option('Code', ''));
		languages.forEach((language) => code.add(new Option(language, language)));
		code.addEventListener('change', () => {
			insert(textarea, '/--code ' + code.value + '\n', '\n\\--');
			code.value = '';
		});
		controls.push(code);
	}

	const preview = document.createElement('div');
	preview.className = 'form-control overflow-auto d-none';

	const toggle = document.createElement('button');
	toggle.type = 'button';
	toggle.className = 'btn btn-sm btn-primary ms-auto';
	toggle.textContent = 'Preview';
	toggle.addEventListener('click', () => {
		const showing = !preview.classList.contains('d-none');
		if (!showing) {
			preview.style.minHeight = textarea.offsetHeight + 'px';
			preview.style.whiteSpace = 'pre-wrap';
			preview.textContent = textarea.value;
		}

		preview.classList.toggle('d-none', showing);
		textarea.classList.toggle('d-none', !showing);
		controls.forEach((control) => control.disabled = !showing);
		toggle.textContent = showing ? 'Preview' : 'Edit';
	});

	toolbar.append(...controls, toggle);
	textarea.before(toolbar);
	textarea.after(preview);
}

for (const textarea of document.querySelectorAll('textarea[data-texy-toolbar]')) {
	createToolbar(textarea);
}
