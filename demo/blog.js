// Demo only: what the scripts of drago do on an article of the blog, with the same markup and classes of Bootstrap,
// so the page shows how it looks and behaves in the theme. Not a part of the package.
//
// 1. The copy button of a code block (copy-code.js of drago-ex/texy-toolbar): in the top right corner of `pre > code`,
//    shown when the mouse is over the block (always on a touch screen), a check for a moment after a copy.
// 2. "Reply" under a comment (comment-reply.js of drago-ex/project-blog): the attribute data-comment-reply
//    ("#2 Name ") is put into the comment form.

const copyIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">'
	+ '<rect x="5.5" y="5.5" width="8" height="9" rx="1.5"/><path d="M10.5 3.5v-1a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1"/></svg>';

const doneIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">'
	+ '<path d="M3 8.5l3 3 7-7"/></svg>';

const alwaysVisible = window.matchMedia('(hover: none)').matches;

for (const code of document.querySelectorAll('pre > code')) {
	const pre = code.parentElement;
	const button = document.createElement('button');
	button.type = 'button';
	button.dataset.copyCode = '';
	button.title = 'Copy';
	button.setAttribute('aria-label', 'Copy');
	button.className = 'btn btn-sm btn-secondary position-absolute top-0 end-0 m-2 lh-1 ' + (alwaysVisible ? 'opacity-75' : 'opacity-0');
	button.innerHTML = copyIcon;

	button.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(code.textContent);
		} catch {
			return;
		}

		button.innerHTML = doneIcon;
		setTimeout(() => button.innerHTML = copyIcon, 1500);
	});

	if (!alwaysVisible) {
		const show = (visible) => button.classList.replace(visible ? 'opacity-0' : 'opacity-75', visible ? 'opacity-75' : 'opacity-0');
		pre.addEventListener('mouseenter', () => show(true));
		pre.addEventListener('mouseleave', () => show(false));
		button.addEventListener('focus', () => show(true));
		button.addEventListener('blur', () => show(false));
	}

	pre.classList.add('position-relative');
	pre.append(button);
}

document.addEventListener('click', (event) => {
	const link = event.target.closest('[data-comment-reply]');
	const textarea = document.querySelector('#comment-form textarea');
	if (!link || !textarea) {
		return;
	}

	event.preventDefault();
	const value = textarea.value.trimEnd();
	textarea.value = (value ? value + '\n' : '') + link.dataset.commentReply;
	textarea.scrollIntoView({ block: 'center', behavior: 'smooth' });
	textarea.focus({ preventScroll: true });
	textarea.setSelectionRange(textarea.value.length, textarea.value.length);
});
