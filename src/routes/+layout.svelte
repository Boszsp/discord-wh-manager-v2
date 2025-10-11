<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LayoutDefault from '$lib/components/app/layout/layout-default.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutProps } from './$types';
	

	let { data, children }: LayoutProps = $props();
	
	
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-right" richColors class="bg-background border" />
<LayoutDefault servers={data?.servers} >
	{@render children?.()}
</LayoutDefault>
