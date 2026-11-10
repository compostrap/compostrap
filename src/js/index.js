import { Sidebar } from './sidebar.js';
import { SidebarMenu } from './sidebar-menu.js';
import { ThemeSwitcher } from './theme-switcher.js';
import { DropzoneInput } from './dropzone.js';
import { Lightbox } from './lightbox.js';
import { Strength } from './strength.js';
import { NumberInput } from './number-input.js';

export class SidebarSkeleton {
	static init() {
		Sidebar.init();
	}
}

export class SidebarMenuApp {
	static init() {
		SidebarMenu.init();
	}
}

export { Sidebar, SidebarMenu, ThemeSwitcher, DropzoneInput, Lightbox, Strength, NumberInput };

// Datepicker is imported from 'compostrap/datepicker' only: it needs the optional vanilla-calendar-pro
