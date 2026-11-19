// Compiles every module and the whole package into dist/css.
import { mkdirSync, writeFileSync } from 'node:fs';
import * as sass from 'sass';

const entries = [
	'theme',
	'compostrap',
	'theme-switcher',
	'tooltip',
	'elements',
	'dialogs',
	'settings',
	'datagrid',
	'selection',
	'sortable',
	'number-input',
	'otp-input',
	'datepicker',
	'rating',
	'chart',
	'gallery',
	'dropzone',
	'lightbox',
	'strength',
	'password-toggle',
	'empty',
	'spinner',
	'auth',
	'shop',
	'blog',
	'sidebar',
	'sidebar-menu',
	'dashboard',
];

mkdirSync('dist/css', { recursive: true });

for (const name of entries) {
	const result = sass.compile(`src/scss/${name}.scss`, {
		loadPaths: ['node_modules'],
		style: 'expanded',
		quietDeps: true,
		// Bootstrap 5.3 can only be loaded by @import, which src/scss/_bootstrap.scss does in one place
		silenceDeprecations: ['import'],
	});

	writeFileSync(`dist/css/${name}.css`, result.css);
}
