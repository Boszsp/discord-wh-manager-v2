import type { sidebarMenuProps } from "$lib/components/app/nav/sidebar.svelte";

export const DEFAULT_SIDEBAR_FIRST_MENU:sidebarMenuProps = {
    image: '/avatar/b.png',
    fallback: 'DWM',
    title: 'Dashboard',
    link: '/',
    class:"mt-0.25"
}

export const APP_NAME = "Discord Webhook Manager"

export const MAX_FILE_SIZE = 24 * 1024 * 1024; // 25 MB in bytes

export const DEFAULT_COLOR_NUM = 5858545

export const PAGE_TRANSITON_BACKLIST = ["/defalut"]

export const DEFAULT_CODE_HIGHLIGHT_THEME = "github-dark-dimmed" ;

export const DEFAULT_WEBHOOK_CONTENT = {
    content: "",
}

export const DEFAULT_WEBHOOK_CONTENT_AS_STRING =  JSON.stringify(DEFAULT_WEBHOOK_CONTENT)


export const DEFAULT_ID_LENGTH = 21