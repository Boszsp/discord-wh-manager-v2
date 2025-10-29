<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LayoutDefault from '$lib/components/app/layout/layout-default.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutProps } from './$types';
	import type{ sidebarMenuProps } from '$lib/components/app/nav/sidebar.svelte';

	let { data, children }: LayoutProps = $props();
	const servers = $derived(data?.servers ?? [])
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-right" richColors class="border bg-background" />
<LayoutDefault servers={servers as sidebarMenuProps[]}>
	{@render children?.()}
</LayoutDefault>
