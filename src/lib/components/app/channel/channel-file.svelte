<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Accordion from '$lib/components/ui/accordion';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { ArrowDown, ArrowUp, ClipboardIcon, FileIcon, SortAsc, Trash } from 'lucide-svelte';
	import { naturalSort } from '$lib/utilsFn/string';

	let { files = $bindable([]), class: className }: { files: File[]; class?: ClassValue } = $props();

	function addFiles(filelist: FileList | null) {
		if (filelist === null) return;
		for (let f of filelist) {
			files.push(f);
		}
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function moveFileUp(index: number) {
		if (index === 0) return;
		const newFiles = [...files];
		const file = newFiles[index];
		newFiles[index] = newFiles[index - 1];
		newFiles[index - 1] = file;
		files = newFiles;
	}

	function moveFileDown(index: number) {
		if (index === files.length - 1) return;
		const newFiles = [...files];
		const file = newFiles[index];
		newFiles[index] = newFiles[index + 1];
		newFiles[index + 1] = file;
		files = newFiles;
	}

	function sortFiles() {
		files = [...files.sort((a, b) => naturalSort(a.name, b.name))];
	}
</script>

<div class={cn('rounded-md border-t bg-card p-4', className)}>
	<div class="mb-2 inline-flex w-full items-end justify-between">
		<Label class="">Attachment</Label>
	</div>
	<div class="inline-flex w-full gap-2">
		<Input
			class="grow"
			onchange={(e) => {
				addFiles(e.currentTarget.files);
			}}
			multiple
			type="file"
		/>
		<Button variant="secondary" size="icon" title="paste from clipboard"
			><ClipboardIcon class="size-4" /></Button
		>
		<Button variant="secondary" size="icon" onclick={sortFiles} title="sort file"
			><SortAsc class="size-4" /></Button
		>
	</div>
	<Accordion.Root type="multiple" value={['files']}>
		<Accordion.Item value="files">
			<Accordion.Trigger class="text-sm"
				>Files
				<p class="ml-auto text-xs text-muted-foreground">Count {files.length}</p>
			</Accordion.Trigger>
			<Accordion.Content class="text-sm">
				<div class="flex flex-col gap-2">
					{#each files as file, i ("channel-file-"+file.name+"-" + i)}
						<div class="inline-flex items-center rounded-md bg-input/20 p-2 text-foreground/60">
							<FileIcon class="mr-2 size-4" />
							<p class="grow">{file.name}</p>
							<div class="inline-flex gap-2">
								<Button
									variant="ghost"
									size="icon"
									class="size-6"
									onclick={() => moveFileUp(i)}
									disabled={i === 0}
								>
									<ArrowUp class="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									class="size-6"
									onclick={() => moveFileDown(i)}
									disabled={i === files.length - 1}
								>
									<ArrowDown class="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									class="size-6 text-destructive"
									onclick={() => removeFile(i)}
								>
									<Trash class="size-4" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
