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
		isFixedSize: z.boolean().default(false)
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
	import { onMount } from 'svelte';
	import DebugValue from './debug-value.svelte';

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

	let { class: className, files = $bindable([])}: { class?: ClassValue; files: FileType[] } = $props();
	let selectedFileId:string[] = $state([])

</script>

<Card class={cn('border-0 border-t bg-secondary/80 overflow-hidden ', className)}>
	<CardHeader>
		<CardTitle>File Manipulation</CardTitle>
		<CardDescription>Manipulation file</CardDescription>
		<DebugValue/>
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
			<Form.Field {form} name="fileSizeLimit">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Maximum Limit Size</Form.Label>
						<Input type="number" {...props} bind:value={$formData.fileSizeLimit} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="isRemoveSoure">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="opacity-0">Rem Source</Form.Label>
						<Toggle {...props} bind:pressed={$formData.isRemoveSoure} class="bg-input/30 transition" variant="outline">
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
			<Form.Field {form} name="isFixedSize">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="opacity-0">Fixed Size</Form.Label>
						<Toggle {...props} bind:pressed={$formData.isFixedSize} class="bg-input/30 transition" variant="outline">
							{#if $formData.isFixedSize}
								<CheckIcon />
							{:else}
								<MinusIcon />
							{/if}
							Fixed pdf-page size</Toggle
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Separator class="my-4" />
		<Label>File Manipulation Menu</Label>
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" class="flex-1"><PackageIcon /> Zip</Button>
			<Button variant="outline" class="flex-1"><PackageOpen /> Unzip</Button>
			<Button variant="outline" class="flex-1"><SquareBottomDashedScissorsIcon /> Split Zip</Button>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" class="flex-1"><FileTextIcon /> Image to PDF</Button>
			<Button variant="outline" class="flex-1"><ImageIcon /> PDF to Image</Button>
			<Button variant="outline" class="flex-1"><SquareBottomDashedScissorsIcon /> Split PDF</Button>
		</div>
		<Separator class="my-4" />
		<div class="grid gap-2">
			<div class="flex flex-wrap w-full gap-2">
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
