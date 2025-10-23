<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import ChannelSidebar from '$lib/components/app/nav/channel-sidebar.svelte';
	import type { Snippet } from 'svelte';
	import type { webhookSchemaType } from '$lib/schema/webhookSchema';
	import { PackageOpenIcon } from 'lucide-svelte';

	let {
		children,
		class: className,
		leftWidth = 20,
		rightWidth = 80,
		channels,
		onCreateChannel,
		onRemoveChannel,
		onEditChannel
	}: {
		children: Snippet;
		class?: ClassValue;
		leftWidth?: number;
		rightWidth?: number;
		channels?: webhookSchemaType[];
		onCreateChannel?: (serverId: string, channel: webhookSchemaType) => Promise<void>;
		onRemoveChannel?: (serverId: string, channelId: string) => void;
		onEditChannel?: (channelId: string, channel: webhookSchemaType) => void;
	} = $props();
</script>

<Resizable.PaneGroup class="h-full" direction="horizontal">
	<Resizable.Pane defaultSize={leftWidth} class="h-full">
		<ChannelSidebar {onEditChannel} {onCreateChannel} {onRemoveChannel} {channels} />
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane class={cn('relative w-fit', className)} defaultSize={rightWidth}>
		{#if channels && channels.length > 0}
			{@render children?.()}
		{:else}
			<div class="flex size-full flex-col items-center justify-center">
				<PackageOpenIcon class="size-16" />
				<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
					Don't have any channel here
				</h3>
				<p class="text-sm text-muted-foreground">Add channel to continue</p>
			</div>
		{/if}
	</Resizable.Pane>
</Resizable.PaneGroup>
