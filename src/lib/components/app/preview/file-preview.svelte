<script lang="ts">
	import { FileIcon } from 'lucide-svelte';
	import type { FileType } from '../types';
	import { cn } from '$lib/utils';
	import { selectedFileStore } from '$lib/store/selected-file-store.svelte';

	const {
		file
	}: {
		file: File | FileType;
	} = $props();

	function handlerOpenFile() {
		let fileURL: string;
		if (file instanceof File) fileURL = URL.createObjectURL(file);
		else fileURL = URL.createObjectURL(file?.file);
		window.open(fileURL);
		setTimeout(() => {
			URL.revokeObjectURL(fileURL);
		}, 1000 * 5); // Revoke after 5 seconds
	}
</script>

<button
	onclick={handlerOpenFile}
	class={cn(
		'relative mt-2 flex w-fit items-center gap-2 rounded-md border bg-card p-4 text-start outline-none overflow-hidden'
	)}
>
	<FileIcon class="size-10 text-muted-foreground" strokeWidth={2} />
	<div class="mr-24 flex flex-col">
		{#if file instanceof File}
			<span class="truncate font-light text-blue-400">{file?.name}</span>
			<span class="text-xs font-light text-muted-foreground">{Math.round(file.size / 1024)} KB</span
			>
		{:else}
			<span class="truncate font-light text-blue-400">{file?.file?.name}</span>
			<span class="text-xs font-light text-muted-foreground"
				>{Math.round(file?.file?.size / 1024)} KB</span
			>
		{/if}
	</div>
	{#if $selectedFileStore.includes((file as FileType)?.id)}
		<div class="absolute inset-0 size-full bg-indigo-800/20"></div>
	{/if}
</button>
