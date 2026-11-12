import { defineConfig } from 'vite';
import path from 'node:path';

const entry = (name) => path.resolve(import.meta.dirname, `src/js/${name}.js`);

export default defineConfig({
	base: '',
	css: {
		preprocessorOptions: {
			scss: {
				quietDeps: true,
				silenceDeprecations: ['import'],
			},
		},
	},
	build: {
		outDir: 'dist/js',
		emptyOutDir: true,
		lib: {
			entry: {
				index: entry('index'),
				sidebar: entry('sidebar'),
				'sidebar-menu': entry('sidebar-menu'),
				'theme-switcher': entry('theme-switcher'),
				tooltip: entry('tooltip'),
				dropzone: entry('dropzone'),
				lightbox: entry('lightbox'),
				strength: entry('strength'),
				'password-toggle': entry('password-toggle'),
				'number-input': entry('number-input'),
				'otp-input': entry('otp-input'),
				selection: entry('selection'),
				datepicker: entry('datepicker'),
				chart: entry('chart'),
				spinner: entry('spinner'),
				dialogs: entry('dialogs'),
			},
			formats: ['es'],
		},
		rollupOptions: {
			external: ['bootstrap', 'vanilla-calendar-pro', 'chart.js'],
			output: {
				entryFileNames: '[name].js',
			},
		},
	},
});
