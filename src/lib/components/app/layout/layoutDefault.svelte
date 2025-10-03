<script>
	import { Button } from '$lib/components/ui/button';
	import { HouseIcon, LogInIcon } from 'lucide-svelte';
	let { children } = $props();
</script>

<header class="flex items-center-safe justify-between border-b px-8 py-2">
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
	<aside>x</aside>
	<main>
		{@render children?.()}
	</main>
</div>
