<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Accordion from '$lib/components/ui/accordion';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { ClipboardIcon, FileIcon } from 'lucide-svelte';

	const { files = $bindable([]), class: className }: { files: File[]; class?: ClassValue } =
		$props();

	function addFiles(filelist: FileList | null) {
		if (filelist === null) return;
		for (let f of filelist) {
			files.push(f);
		}
	}
</script>

<div class={cn('rounded-md border-t bg-card p-4', className)}>
	<Label class="mb-2">Files</Label>
	<div class="inline-flex w-full gap-2">
		<Input
			class="grow"
			onchange={(e) => {
				addFiles(e.currentTarget.files);
			}}
			multiple
			type="file"
		/>
		<Button variant="outline" size="icon"><ClipboardIcon /></Button>
	</div>
	<Accordion.Root type="multiple" value={["files"]}>
		<Accordion.Item value="files">
			<Accordion.Trigger class="text-sm">Files</Accordion.Trigger>
			<Accordion.Content class="text-sm">
                <div class="flex flex-col gap-2">
				{#each files as file}
					<div class="bg-input/20 p-2 inline-flex items-center rounded-md text-foreground/60 ">
                        <FileIcon class="size-4 mr-2" />
						<p>{file.name}</p>
					</div>
				{/each}
                </div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
