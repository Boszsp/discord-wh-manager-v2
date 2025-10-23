<script lang="ts">
	import { HouseIcon, LogInIcon, ServerIcon } from 'lucide-svelte';
	import Sidebar, { type sidebarMenuProps } from '$lib/components/app/nav/sidebar.svelte';
	import { page } from '$app/state';
	import { APP_NAME } from '$lib/default';
	import type { Snippet } from 'svelte';

	let { children, servers = [] }: { children: Snippet; servers?: sidebarMenuProps[] } = $props();
	const datas: sidebarMenuProps[] = $derived(
		servers?.map((v, id) => ({
			//fallback: v.fallback ?? "$",
			id: v?.id ?? id + '',
			title: v.title,
			link: v.link,
			color: v.color,
			isSelected: page.url.searchParams.get('id') === `${v?.id}`
		})) ?? []
	);
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
					<img src="/logo-flat.png" alt="logo" class="mr-2 w-4" />
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
	<div class="flex h-full w-full">
		<Sidebar sidebarMenu={datas} />
		<main class="h-[96dvh] w-full overflow-hidden rounded-tl-2xl border-t border-l">
			{@render children?.()}
		</main>
	</div>
</div>
