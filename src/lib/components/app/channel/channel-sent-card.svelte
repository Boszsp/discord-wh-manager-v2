<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { HashIcon, SendIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import Autocomplelte from '$lib/components/app/form/autocomplete.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	interface serverProps {
		id?: string | number;
		name?: string | number;
	}
	const {
		server,
		channel,
		onsent
	}: {
		server?: serverProps;
		channel?: serverProps;
		onsent: (
			e?:
				| (MouseEvent & {
						currentTarget: EventTarget & HTMLButtonElement;
				  })
				| (MouseEvent & {
						currentTarget: EventTarget & HTMLAnchorElement;
				  })
		) => void;
	} = $props();

	const isMoble = new IsMobile();
</script>

<Card
	class="overflow-hidde mb-4 w-full bg-indigo-800 bg-gradient-to-br bg-[url('/banner-1.png')] from-indigo-800 to-violet-950 bg-cover p-4"
>
	<div class="center inline-flex h-full w-full gap-4">
		<span class="grow">
			<div
				class="inline-flex w-full items-center gap-1 rounded-md border-t bg-input/40 p-2 text-sm"
			>
				<HashIcon class="size-4" />
				<span>Channel: {channel?.name} </span>
				<span>(Server: {server?.name} ) </span>
			</div>
		</span>
		<span>
			<Button onclick={onsent} class="h-full"><SendIcon /></Button>
		</span>
	</div>
	<div>
		<Label for="template-select">Template</Label>
		<Autocomplelte class="mt-2 border-0 border-t" id="template-select" />
	</div>
</Card>
