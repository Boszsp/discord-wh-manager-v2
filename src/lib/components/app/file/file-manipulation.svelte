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
		isRemoveSoure: z.boolean().default(true),
		isFixedSize: z.boolean().default(true),
		compressLevel: z.number().min(0).max(9).default(6),
		processAll: z.boolean().default(true)
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
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
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
	import { splitFile } from '$lib/utilsFn/file-splitter';
	import { consola } from 'consola';

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
		const processFile = files.filter(
			(file) => $formData.processAll || $selectedFileStore.includes(file.id)
		);

		if (processFile.length < 1) return onEmptyProcessFile();
		createZip(
			processFile.map((file) => file.file),
			{
				filename: $formData?.fileName,
				level: $formData.compressLevel as 0 | 1 | 3 | 9 | 6 | 8 | 2 | 4 | 5 | 7 | undefined
			}
		)
			.then((z) => {
				addFileHandler(z, processFile);
			})
			.catch((err) => {
				consola.error(err);
				toast.error(err.message);
				loading = false;
			});
	}
	function onUnZipHandler() {
		loading = true;
		const processFile = files.filter(
			(f) =>
				($formData.processAll || $selectedFileStore.includes(f.id)) &&
				zipMimeTypeList.includes(f?.file?.type)
		);
		if (processFile.length < 1) return onEmptyProcessFile();
		processFile.map((z, i) => {
			unzipFiles(z?.file)
				.then((f) => {
					loading = true;
					addFileHandler(f, [{ id: z.id, file: new File([], 'temp.txt') }]);
				})
				.catch((err) => {
					consola.error(err);
					toast.error(err.message);
					loading = false;
				});
		});
	}
	function onPdf() {
		loading = true;
		const processFile = files.filter(
			(f) => $formData.processAll || $selectedFileStore.includes(f.id)
		);
		if (processFile.length < 1) return onEmptyProcessFile();
		createPdfFromImages(
			processFile.map((f) => f.file),
			$formData.fileName,
			$formData.isFixedSize
		)
			.then((p) => addFileHandler(p, processFile))
			.catch((err) => {
				consola.error(err);
				toast.error(err.message);
				loading = false;
			});
	}
	function onUnPdf() {
		loading = true;
		const processFile = files.filter(
			(f) =>
				($formData.processAll || $selectedFileStore.includes(f.id)) &&
				pdfMimeTypeList.includes(f?.file?.type)
		);
		if (processFile.length < 1) return onEmptyProcessFile();
		processFile.map((p) =>
			extractPdfImages(p?.file, $formData.fileName)
				.then((im) => {
					loading = true;
					addFileHandler(im, [{ id: p.id, file: new File([], 'temp.txt') }]);
				})
				.catch((err) => {
					consola.error(err);
					toast.error(err.message);
					loading = false;
				})
		);
	}

	function onSplitFileHandler() {
		loading = true;
		const processFile = files.filter(
			(f) =>
				($formData.processAll || $selectedFileStore.includes(f.id)) &&
				(pdfMimeTypeList.includes(f?.file?.type) || zipMimeTypeList.includes(f?.file?.type))
		);
		if (processFile.length < 1) return onEmptyProcessFile();
		processFile.map((p) =>
			splitFile(
				p?.file,
				$formData.fileSizeLimit,
				$formData.compressLevel as 0 | 1 | 3 | 9 | 6 | 8 | 2 | 4 | 5 | 7 | undefined
			)
				.then((f) => {
					loading = true;
					addFileHandler(f, [{ id: p.id, file: new File([], 'temp.txt') }]);
				})
				.catch((err) => {
					consola.error(err);
					toast.error(err.message);
					loading = false;
				})
		);
	}

	function onChangeExtensionHandler() {
		loading = true;
		const processFile = files.filter(
			(f) =>
				($formData.processAll || $selectedFileStore.includes(f.id)) &&
				f?.file?.type.startsWith('image')
		);
		if (processFile.length < 1) return onEmptyProcessFile();

		const promises = processFile.map((f) => {
			return new Promise<File>((resolve, reject) => {
				const img = new Image();
				img.src = URL.createObjectURL(f.file);
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');
					if (!ctx) return reject('no context');

					canvas.width = img.width * $formData.scale;
					canvas.height = img.height * $formData.scale;

					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

					canvas.toBlob(
						(blob) => {
							if (!blob) return reject('no blob');
							const newFile = new File(
								[blob],
								`${f.file.name.split('.').slice(0, -1).join('.')}.${$formData.extension}`,
								{ type: `image/${$formData.extension}` }
							);
							resolve(newFile);
						},
						`image/${$formData.extension}`,
						$formData.quality / 100
					);
				};
			});
		});

		Promise.all(promises)
			.then((newFiles) => {
				addFileHandler(newFiles, processFile);
			})
			.catch((err) => {
				consola.error(err);
				toast.error(err.message);
				loading = false;
			});
	}
</script>

<Accordion
	class={cn('relative overflow-hidden rounded-md border-0 border-t bg-secondary/80', className)}
	type="single"
>
	<AccordionItem value="item-1">
		<AccordionTrigger class="px-6">
			<div>
				<CardTitle>File Manipulation</CardTitle>
				<CardDescription>Manipulation file</CardDescription>
			</div>
		</AccordionTrigger>
		<AccordionContent>
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
					<Form.Field {form} name="compressLevel" class="flex-1">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Compress Level</Form.Label>
								<Input type="number" {...props} bind:value={$formData.compressLevel} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="flex flex-wrap gap-2">
					<Form.Field {form} name="isRemoveSoure" class="flex-1">
						<Form.Control>
							{#snippet children({ props })}
								<Toggle
									{...props}
									bind:pressed={$formData.isRemoveSoure}
									class="w-full bg-input/30 transition data-[state=on]:bg-primary/40"
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
								<Toggle
									{...props}
									bind:pressed={$formData.isFixedSize}
									class="w-full bg-input/30 transition data-[state=on]:bg-primary/40"
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
								<Toggle
									{...props}
									bind:pressed={$formData.processAll}
									class="w-full bg-input/30 transition data-[state=on]:bg-primary/40"
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
					<Button variant="outline" class="flex-1" onclick={onZipHandler} disabled={loading}
						><PackageIcon /> Zip</Button
					>
					<Button variant="outline" class="flex-1" onclick={onUnZipHandler} disabled={loading}
						><PackageOpen /> Unzip</Button
					>
				</div>
				<div class="flex flex-wrap gap-2">
					<Button variant="outline" class="flex-1" onclick={onPdf} disabled={loading}
						><FileTextIcon /> Image to PDF</Button
					>
					<Button variant="outline" class="flex-1" onclick={onUnPdf} disabled={loading}
						><ImageIcon /> PDF to Image</Button
					>
				</div>
				<div class="flex flex-wrap gap-2">
					<Button variant="outline" class="flex-1" onclick={onSplitFileHandler} disabled={loading}
						><SquareBottomDashedScissorsIcon /> Split File</Button
					>
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
							<Button variant="outline" onclick={onChangeExtensionHandler} disabled={loading}
								>Change Extension</Button
							>
						</div>
					</div>
				</div>
			</CardContent>
		</AccordionContent>
	</AccordionItem>
</Accordion>
