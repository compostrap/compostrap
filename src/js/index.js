import { Sidebar } from './sidebar.js';
import { SidebarMenu } from './sidebar-menu.js';
import { ThemeSwitcher } from './theme-switcher.js';
import { DropzoneInput } from './dropzone.js';
import { Lightbox } from './lightbox.js';
import { Strength } from './strength.js';
import { PasswordToggle } from './password-toggle.js';
import { NumberInput } from './number-input.js';
import { OtpInput } from './otp-input.js';
import { RowSelection } from './selection.js';
import { SortableList } from './sortable.js';
import { Spinner } from './spinner.js';
import { Dialogs } from './dialogs.js';
import { CssTooltip } from './tooltip.js';

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

export { Sidebar, SidebarMenu, ThemeSwitcher, DropzoneInput, Lightbox, Strength, PasswordToggle, NumberInput, OtpInput, RowSelection, SortableList, Spinner, Dialogs, CssTooltip };

// Datepicker is imported from 'compostrap/datepicker' only: it needs the optional vanilla-calendar-pro
