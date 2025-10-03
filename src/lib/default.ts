import type { sidebarMenuProps } from "$lib/components/app/nav/sidebar.svelte";

export const DEFAULT_SIDEBAR_FIRST_MENU:sidebarMenuProps = {
    image: '/logo.png',
    fallback: 'DWM',
    title: 'Dashboard',
    link: '/',
}

export const APP_NAME = "Discord Webhook Manager v.2"