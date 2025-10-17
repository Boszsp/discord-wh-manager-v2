<script lang="ts" module>
	import { z } from 'zod/v4';
	import { MAX_FILE_SIZE } from '$lib/default';

	const formSchema = z.object({
		quality: z.number().min(0).max(100).default(100),
		scale: z.number().min(0).max(1).default(1),
		extension: z.enum(['png', 'jpg', 'webp']).default('jpg'),
		fileSizeLimit: z
			.number()
			.min(1)
			.default(MAX_FILE_SIZE / 1024 / 1024),
		fileName: z.string().trim(),
		isRemoveSoure: z.boolean().default(false),
		isFixedSize: z.boolean().default(true),
		compressLevel: z.number().min(0).max(9).default(6),
		processAll:z.boolean().default(true)
	});
</script>

<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import {
		CheckIcon,
		FileTextIcon,
		ImageIcon,
		MinusIcon,
		PackageIcon,
		PackageOpen,
		SquareBottomDashedScissorsIcon
	} from 'lucide-svelte';
	import { Toggle } from '$lib/components/ui/toggle';
	import FileManipulationSelectedfile from './file-manipulation-selectedfile.svelte';
	import type { FileType } from '../types';
	import { createZip, unzipFiles, zipMimeTypeList } from '$lib/utilsFn/zip';
	import { nanoid } from 'nanoid';
	import { Spinner } from '$lib/components/ui/spinner';
	import { selectedFileStore } from '$lib/store/selected-file-store.svelte';
	import { createPdfFromImages, extractPdfImages, pdfMimeTypeList } from '$lib/utilsFn/pdf';

	const form = superForm(defaults(zod4(formSchema)), {
		validators: zod4(formSchema),
		validationMethod: 'oninput',
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData } = form;

	let { class: className, files = $bindable([]) }: { class?: ClassValue; files: FileType[] } =
		$props();
	let loading = $state(false);

	function addFileHandler(file: File | File[], processedFiles: FileType[] = []) {
		if ($formData.isRemoveSoure)
			files = files.filter((file) => !processedFiles.map((v) => v.id).includes(file.id));
		let tempFiles = [...files];
		if (Array.isArray(file))
			tempFiles = tempFiles.concat(file.map((f) => ({ id: nanoid(8), file: f })));
		else
			tempFiles.push({
				id: nanoid(8),
				file
			});
		files = tempFiles;
		loading = false;
	}

	function onEmptyProcessFile() {
		toast.error('Not Have File Can Process Or Selected');
		loading = false;
	}

	function onZipHandler() {
		loading = true;
		const processFile = files.filter((file) => $formData.processAll || $selectedFileStore.includes(file.id));

		if (processFile.length < 1) return onEmptyProcessFile();
		createZip(
			processFile.map((file) => file.file),
			{
				filename: $formData?.fileName
			}
		).then((z) => {
			addFileHandler(z, processFile);
		});
	}
	function onUnZipHandler() {
		loading = true;
		const processFile = files.filter(
			(f) =>  $formData.processAll || $selectedFileStore.includes(f.id) && zipMimeTypeList.includes(f?.file?.type)
		);
		if (processFile.length < 1) return onEmptyProcessFile();
		processFile.map((z, i) => {
			unzipFiles(z?.file).then((f) => {
				loading = true;
				addFileHandler(f, [{ id: z.id, file: new File([], 'temp.txt') }]);
			});
		});
	}
	function onPdf() {
		loading = true;
		const processFile = files.filter((f) =>  $formData.processAll ||  $selectedFileStore.includes(f.id));
		if (processFile.length < 1) return onEmptyProcessFile();
		createPdfFromImages(
			processFile.map((f) => f.file),
			$formData.fileName,
			$formData.isFixedSize
		).then((p) => addFileHandler(p, processFile));
	}
	function onUnPdf() {
		loading = true;
		const processFile = files.filter(
			(f) =>  $formData.processAll || $selectedFileStore.includes(f.id) && pdfMimeTypeList.includes(f?.file?.type)
		);
		if (processFile.length < 1) return onEmptyProcessFile();
		processFile.map((p) =>
			extractPdfImages(p?.file, $formData.fileName).then((im) => {
				loading = true;
				addFileHandler(im, [{ id: p.id, file: new File([], 'temp.txt') }]);
			})
		);
	}
</script>

<Card class={cn('relative overflow-hidden border-0 border-t bg-secondary/80', className)}>
	{#if loading}
		<div
			class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs"
		>
			<Spinner class="mr-2 size-8" />
			<small class="text-sm leading-none font-medium">Processing...</small>
		</div>
	{/if}
	<CardHeader>
		<CardTitle>File Manipulation</CardTitle>
		<CardDescription>Manipulation file</CardDescription>
	</CardHeader>
	<CardContent class="grid gap-4">
		<FileManipulationSelectedfile {files} />
		<Form.Field {form} name="fileName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.fileName} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex flex-wrap gap-2">
			<Form.Field {form} name="fileSizeLimit" class="flex-1">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Maximum Limit Size</Form.Label>
						<Input type="number" {...props} bind:value={$formData.fileSizeLimit} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="isRemoveSoure" class="flex-1">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="opacity-0">Rem Source</Form.Label>
						<Toggle
							{...props}
							bind:pressed={$formData.isRemoveSoure}
							class="bg-input/30 transition data-[state=on]:bg-primary/40"
							variant="outline"
						>
							{#if $formData.isRemoveSoure}
								<CheckIcon />
							{:else}
								<MinusIcon />
							{/if}
							Remove source</Toggle
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="isFixedSize" class="flex-1">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="opacity-0">Fixed Size</Form.Label>
						<Toggle
							{...props}
							bind:pressed={$formData.isFixedSize}
							class="bg-input/30 transition data-[state=on]:bg-primary/40"
							variant="outline"
						>
							{#if $formData.isFixedSize}
								<CheckIcon />
							{:else}
								<MinusIcon />
							{/if}
							Fixed pageSize</Toggle
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="processAll" class="flex-1">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="opacity-0">Process All</Form.Label>
						<Toggle
							{...props}
							bind:pressed={$formData.processAll}
							class="bg-input/30 transition data-[state=on]:bg-primary/40"
							variant="outline"
						>
							{#if $formData.processAll}
								<CheckIcon />
							{:else}
								<MinusIcon />
							{/if}
							ProcessAll file</Toggle
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Separator class="my-4" />
		<Label>File Manipulation Menu</Label>
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" class="flex-1" onclick={onZipHandler}><PackageIcon /> Zip</Button>
			<Button variant="outline" class="flex-1" onclick={onUnZipHandler}
				><PackageOpen /> Unzip</Button
			>
			<Button variant="outline" class="flex-1"><SquareBottomDashedScissorsIcon /> Split Zip</Button>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" class="flex-1" onclick={onPdf}><FileTextIcon /> Image to PDF</Button
			>
			<Button variant="outline" class="flex-1" onclick={onUnPdf}><ImageIcon /> PDF to Image</Button>
			<Button variant="outline" class="flex-1"><SquareBottomDashedScissorsIcon /> Split PDF</Button>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-2">
			<div class="flex w-full flex-wrap gap-2">
				<Form.Field {form} name="quality">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Quality</Form.Label>
							<Input type="number" {...props} bind:value={$formData.quality} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="scale">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Scale</Form.Label>
							<Input step="0.1" type="number" {...props} bind:value={$formData.scale} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="extension">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Extension</Form.Label>
							<Select.Root type="single" bind:value={$formData.extension}>
								<Select.Trigger class="w-full min-w-28" {...props}>
									{$formData.extension ? $formData.extension : 'Select a verified extension'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="jpg">jpg</Select.Item>
									<Select.Item value="png">png</Select.Item>
									<Select.Item value="webp">webp</Select.Item>
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="ml-auto">
					<Label class="mb-2 opacity-0">Button</Label>
					<Button variant="outline">Change Extension</Button>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
