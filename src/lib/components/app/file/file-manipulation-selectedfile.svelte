<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import FileCardSelectable from './file-card-selectable.svelte';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let { class: className, files = $bindable([]), selectedFile = $bindable([]) }: { class?: ClassValue; files?: File[] } = $props();
</script>

<div class={cn('h-80 w-full overflow-y-auto rounded-md bg-theme-accent p-4 pt-0', className)}>
	<div class="sticky top-0 pt-4 bg-theme-accent">
		<InputGroup.Root>
			<InputGroup.Input placeholder="Search..." />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button>Select All</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
	{#each new Array(9) as file, i (i)}
		<FileCardSelectable title={'x' + i} description={'d' + i} />
	{/each}
</div>
