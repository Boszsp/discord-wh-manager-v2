<script lang="ts">
	import { HouseIcon, LogInIcon, ServerIcon } from 'lucide-svelte';
	import Sidebar, { type sidebarMenuProps } from '$lib/components/app/nav/sidebar.svelte';
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import { APP_NAME } from '$lib/default';

	let { children } = $props();
	const datas: sidebarMenuProps[] = $derived([
		{
			fallback: 'xx',
			title: 'bg',
			link: '/channel?id=1',
			color: 'red',
			isSelected: page.url.searchParams.get('id') === '1'
		},
		{
			fallback: 'xx22',
			title: 'bg22',
			link: '/channel?id=2',
			isSelected: page.url.searchParams.get('id') === '2'
		}
	]);
	const selected = $derived(datas.filter((v) => v.isSelected).pop());
</script>

<div class="h-dvh w-dvw overflow-hidden bg-theme-accent">
	<header class="flex items-center-safe justify-between px-8 py-2">
		<span></span>
		<span>
			<a href="/" class="flex items-center justify-self-center-safe">
				{#if selected}
					<ServerIcon class="mr-2 size-4" />
					<small class="text-sm leading-none font-medium">
						{selected.title}
					</small>
				{:else}
					<img src="/logo.png" alt="logo" class="mr-2 size-4" />
					<small class="text-sm leading-none font-medium">{APP_NAME}</small>
				{/if}
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
		<main class="h-[96dvh] w-full rounded-tl-2xl border-t border-l">
			{@render children?.()}
		</main>
	</div>
</div>
