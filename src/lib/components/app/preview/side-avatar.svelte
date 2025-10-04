<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { CardTitle } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { convertToFallbackString } from '$lib/utilsFn/string';
	import type { Snippet } from 'svelte';

	let {
		children,
		image = '/webhook/dwh.png',
		name = 'Webhook Name'
	}: {
		children: Snippet;
		image?: string;
		name?: string;
	} = $props();

    let dateTime = $state(new Date().toLocaleString())
</script>

<div class="inline-flex gap-4 items-start">
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
        <div class="font-semibold inline-flex items-start gap-1">
            {name} <span class="text-xs font-bold bg-primary p-0.25 mt-0.5 px-1 rounded-sm">App</span>
            <span class="text-xs font-normal mt-1.5">{dateTime}</span>
        </div>
        <div>
        {@render children?.()}
        </div>
    </span>
</div>
