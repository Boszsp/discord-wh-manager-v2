<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LayoutDefault from '$lib/components/app/layout/layout-default.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { LayoutProps } from './$types';
	import type { sidebarMenuProps } from '$lib/components/app/nav/sidebar.svelte';

	let { data, children }: LayoutProps = $props();
	const servers = $derived(data?.servers ?? []);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Primary Meta Tags -->
	<title>TWH</title>
	<meta name="title" content="TWH" />
	<meta name="description" content="This Webhook Manager Version2" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="TWH" />
	<meta property="og:description" content="This Webhook Manager Version2" />
	<meta property="og:image" content="/seo.jpg" />

	<!-- X (Twitter) -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="TWH" />
	<meta property="twitter:description" content="This Webhook Manager Version2" />
	<meta property="twitter:image" content="/seo.jpg" />

	<!-- Meta Tags Generated with https://metatags.io -->
</svelte:head>

<Toaster position="top-right" richColors class="border bg-background" />
<LayoutDefault servers={servers as sidebarMenuProps[]}>
	{@render children?.()}
</LayoutDefault>
