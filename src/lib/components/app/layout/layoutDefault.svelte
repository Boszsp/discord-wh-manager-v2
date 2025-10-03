<script lang="ts">
	import { HouseIcon, LogInIcon } from 'lucide-svelte';
	import Sidebar, { type sidebarMenuProps } from '$lib/components/app/nav/sidebar.svelte';
	import { page } from '$app/state';

	let { children } = $props();
	const datas:sidebarMenuProps[] = $derived([
		{
			fallback: 'xx',
			title: 'bg',
			link:'/channel?id=1',
			isSelected: page.url.searchParams.get("id") === "1"
		},
		{
			fallback: 'xx22',
			title: 'bg22',
			link:'/channel?id=2',
			isSelected: page.url.searchParams.get("id") === "2"
		}
	])
</script>
<div class="h-dvh w-dvw overflow-hidden bg-theme-accent">
<header class="flex items-center-safe justify-between px-8 py-2">
	<span></span>
	<span>
		<a href="/" class="flex items-center justify-self-center-safe">
			<HouseIcon class="mr-2 size-4" />
			<small class="text-sm leading-none font-medium">Home</small>
		</a>
	</span>
	<span>
		<a href="/login">
			<LogInIcon class="size-4" />
		</a>
	</span>
</header>
<div class="flex">
	<Sidebar sidebarMenu={datas} />
	<main class="w-full h-[96dvh] border-t border-l rounded-tl-2xl">
		{@render children?.()}
	</main>
</div>
</div>
