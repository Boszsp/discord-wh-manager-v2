import type { sidebarMenuProps } from './nav/sidebar.svelte';

export interface ServerType extends sidebarMenuProps {
	id: string;
}

export interface FileType {
	id: string;
	file: File;
}
