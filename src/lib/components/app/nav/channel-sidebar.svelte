<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { HashIcon,CirclePlusIcon } from 'lucide-svelte';
	import { page } from '$app/state';
	import { Separator } from '$lib/components/ui/separator';

	const { name = 'Server Name' }: { name?: string } = $props();
</script>

<nav>
	<div class="border-b p-2">
		<CardTitle class="mx-auto rounded-md p-2">{name}</CardTitle>
	</div>
	<ScrollArea class="h-full p-2">
		<div class="py-2">
			<Button onclick={() => goto('/server')} size="sm" variant="ghost" class="w-full justify-start"
				><CirclePlusIcon />Add New</Button
			>
		</div>
		<Separator class="my-2" />
		<div >
			<small class="px-2 text-sm leading-none font-medium text-muted-foreground"
				>Webhooks | เว็บฮุก</small
			>
		</div>
		<div class="flex flex-col gap-1">
			<Button
				onclick={() => goto('/server')}
				size="sm"
				variant={page.route.id === '/server' ? 'secondary' : 'ghost'}
				class="w-full justify-start text-start"><HashIcon />Ch1</Button
			>
		</div>
	</ScrollArea>
</nav>
