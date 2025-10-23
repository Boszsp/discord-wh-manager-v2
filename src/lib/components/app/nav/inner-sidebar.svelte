<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { LayoutTemplateIcon, ServerIcon, CogIcon, BadgeInfoIcon } from 'lucide-svelte';
	import { page } from '$app/state';
</script>

<nav>
	<div class="border-b p-2">
		<CardTitle class="mx-auto rounded-md bg-secondary p-2 text-center">Home Page</CardTitle>
	</div>
	<ScrollArea class="h-full p-2">
		<Button
			onclick={() => goto('/default')}
			variant={page.route.id === '/default' ? 'secondary' : 'ghost'}
			class="w-full justify-start text-start"><BadgeInfoIcon />Default</Button
		>
		<Button
			onclick={() => goto('/server')}
			variant={page.route.id === '/server' ? 'secondary' : 'ghost'}
			class="w-full justify-start text-start"><ServerIcon />Server</Button
		>
		<Button
			onclick={() => goto('/template')}
			variant={page.route.id === '/template' ? 'secondary' : 'ghost'}
			class="w-full justify-start text-start"><LayoutTemplateIcon />Template</Button
		>
		<Button
			onclick={() => goto('/setting')}
			variant={page.route.id === '/setting' ? 'secondary' : 'ghost'}
			class="w-full justify-start text-start"><CogIcon />Setting</Button
		>
	</ScrollArea>
</nav>
