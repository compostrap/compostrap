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
				dropzone: entry('dropzone'),
				lightbox: entry('lightbox'),
				strength: entry('strength'),
				'number-input': entry('number-input'),
				datepicker: entry('datepicker'),
				chart: entry('chart'),
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
