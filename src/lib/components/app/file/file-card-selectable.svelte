<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import type { ClassValue } from 'svelte/elements';
	import { selectedFileStore } from '../../../store/selected-file-store.svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { zipMimeTypeList } from '$lib/utilsFn/zip';
	import ZipPreviewDialog from './zip-preview-dialog.svelte';
	import type { FileType } from '../types';

	let {
		id,
		title,
		description,
		file,
		class: className
	}: {
		title: string;
		description: string;
		id: string;
		file: FileType;
		class?: ClassValue;
	} = $props();
	let count = $state(0);
	let showPreview = $state(false);

	function clickHandler() {
		if (count === 0) {
			const tempSet = new Set($selectedFileStore);
			if (tempSet.has(id)) tempSet.delete(id);
			else tempSet.add(id);
			$selectedFileStore = [...tempSet];
			count += 1;
			return;
		} else {
			count = 0;
			return;
		}
	}
</script>

{#if zipMimeTypeList.includes(file.file.type)}
	<ZipPreviewDialog bind:open={showPreview} file={file.file} />
{/if}
{#key $selectedFileStore}
	<div
		class={cn(
			'flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[:checked]:border-indigo-600',
			'has-[:checked]:bg-indigo-50 dark:has-[:checked]:border-indigo-900 dark:has-[:checked]:bg-indigo-950',
			className
		)}
	>
		<Label class="flex items-center gap-3" aria-label={id} onclick={clickHandler}>
			<Checkbox
				id="toggle-2"
				checked={$selectedFileStore.includes(id)}
				value={id}
				class="data-[state=checked]:border-secondary data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white dark:data-[state=checked]:border-indigo-700 dark:data-[state=checked]:bg-indigo-700"
			/>
			<div class="grid gap-1.5 font-normal">
				<p class="text-sm leading-none font-medium">
					{title?.split('.').slice(0, -1).join('').slice(0, 48)}{title?.length > 48 ? '...' : ''}.{title?.split('.')?.pop()}
				</p>
				<p class="text-xs text-muted-foreground">{description}</p>
			</div>
		</Label>
		{#if zipMimeTypeList.includes(file.file.type)}
			<Button
				size="icon"
				variant="ghost"
				class="ml-auto h-8 w-8"
				onclick={() => (showPreview = true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-file-archive"
					><path d="M4 22V4c0-1.1.9-2 2-2h8.5L20 7.5V20c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z" /><path
						d="M14 2v6h6"
					/><path d="M10 12.5v-1" /><path d="M10 17.5v-1" /><path d="M10 15h-1" /><path
						d="M10 15h1"
					/></svg
				>
			</Button>
		{/if}
	</div>
{/key}

