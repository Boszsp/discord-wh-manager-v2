<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { unzipFiles } from '$lib/utilsFn/zip';
	import { onMount } from 'svelte';
	import FileTree from './file-tree.svelte';

	let {
		file,
		open = $bindable(false)
	}: {
		file: File;
		open: boolean;
	} = $props();

	let files = $state<File[]>([]);
	let loading = $state(false);

	async function loadFiles() {
		loading = true;
		try {
			files = await unzipFiles(file);
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (open) {
			loadFiles();
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Zip Preview</Dialog.Title>
			<Dialog.Description>{file.name}</Dialog.Description>
		</Dialog.Header>
		{#if loading}
			<div class="flex items-center justify-center">
				<p>Loading...</p>
			</div>
		{:else}
			<FileTree {files} />
		{/if}
		<Dialog.Footer>
			<Button onclick={() => (open = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
