<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LayoutDefault from '$lib/components/app/layout/layout-default.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/state';
	

	let { children } = $props();
	
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<LayoutDefault>
	{@render children?.()}
</LayoutDefault>
