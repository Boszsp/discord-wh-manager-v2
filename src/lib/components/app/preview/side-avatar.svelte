<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { CardTitle } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { convertToFallbackString } from '$lib/utilsFn/string';
	import type { Snippet } from 'svelte';
	import './side-avatar.css';
	import PreviewMd from './preview-md.svelte';

	let {
		children,
		image = '/webhook/dwh-sm.png',
		name = 'Webhook Name',
		content = ""
	}: {
		children: Snippet;
		image?: string;
		name?: string;
		content?: string;
	} = $props();

	let dateTime = $state(new Date().toLocaleString());
</script>

<div class="inline-flex items-start gap-4">
	<span class="mt-1">
		<Avatar.Root class={cn('text-primary-secondary size-10 rounded-full bg-secondary/60')}>
			<Avatar.Image src={image} alt="wh logo" class="object-cover" />
			<Avatar.Fallback class="scale-75 bg-transparent"
				>{convertToFallbackString(name ?? '')}</Avatar.Fallback
			>
		</Avatar.Root>
	</span>
	<span>
		<CardTitle class="font-semibold"></CardTitle>
		<div class="inline-flex items-start gap-1 truncate font-semibold">
			{name}
			<span class="mt-0.5 truncate rounded-sm bg-primary p-0.25 px-1 text-xs font-bold">App</span>
			<span class="mt-1.5 truncate text-xs font-normal">{dateTime}</span>
		</div>
		<PreviewMd {content} />
		<div>
			{@render children?.()}
		</div>
	</span>
</div>
