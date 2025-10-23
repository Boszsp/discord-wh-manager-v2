<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable';
	import type { ClassValue } from 'svelte/elements';
	import InnerSidebar from '$lib/components/app/nav/inner-sidebar.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	let {
		children,
		class: className,
		leftWidth = 22,
		rightWidth = 78
	}: {
		children: Snippet;
		class?: ClassValue;
		leftWidth?: number;
		rightWidth?: number;
	} = $props();
</script>

<Resizable.PaneGroup class="h-full" direction="horizontal">
	<Resizable.Pane defaultSize={leftWidth} class="h-full">
		<InnerSidebar />
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane class={cn('relative w-fit', className)} defaultSize={rightWidth}>
		{@render children?.()}
	</Resizable.Pane>
</Resizable.PaneGroup>
