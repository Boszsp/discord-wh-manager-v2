<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import FileCardSelectable from './file-card-selectable.svelte';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import type { FileType } from '../types';

	let { class: className, files = $bindable([]) }: { class?: ClassValue; files?: FileType[] } = $props();

	
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
	{#each files as file, i ("file-selected-mani-"+i)}
		<FileCardSelectable id={file?.id}  title={file?.file?.name} description={'d' + i}  />
	
	{/each}
</div>
