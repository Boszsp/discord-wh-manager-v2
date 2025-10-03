<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LayoutDefault from '$lib/components/app/layout/layoutDefault.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<LayoutDefault>
	{@render children?.()}
</LayoutDefault>
