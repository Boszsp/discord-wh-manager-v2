<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import FileCardSelectable from './file-card-selectable.svelte';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import type { FileType } from '../types';
	import { formatFileSize } from '$lib/utilsFn/file';
	import { selectedFileStore } from '../../../store/selected-file-store.svelte';

	let { class: className, files = $bindable([]) }: { class?: ClassValue; files?: FileType[] } =
		$props();
	let filterString = $state('');

	function selectAll() {
		if ($selectedFileStore.length === files.length) {
			selectedFileStore.set([]);
			return;
		}
		selectedFileStore.set(files?.map((v) => v?.id));
	}
</script>

<div class={cn('h-80 w-full overflow-y-auto rounded-md bg-card p-4 pt-0', className)}>
	<div class="sticky top-0 bg-card py-4">
		<InputGroup.Root>
			<InputGroup.Input bind:value={filterString} placeholder="Search..." />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button onclick={selectAll}>Select All</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
	<div class="grid gap-2">
		{#each files.filter((f) => filterString?.length < 1 || f?.file?.name?.includes(filterString)) as file, i ('file-selected-mani-' + i)}
			<FileCardSelectable
				id={file?.id}
				title={file?.file?.name}
				description={`${formatFileSize(file?.file?.size)} | ${file?.file?.type}`}
			/>
		{/each}
	</div>
</div>
