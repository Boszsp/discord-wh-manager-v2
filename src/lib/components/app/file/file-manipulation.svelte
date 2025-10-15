<script lang="ts" module>
	import { z } from 'zod/v4';

	const formSchema = z.object({
		quality: z.number().min(0).max(100).default(100),
		scale: z.number().min(0).max(1).default(1),
		extension: z.enum(['png', 'jpg', 'webp']).default('jpg')
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

	const { form: formData, enhance } = form;

	let { class: className, files = $bindable([]) }: { class?: ClassValue; files: File[] } = $props();
</script>

<Card class={cn('border-0 border-t bg-secondary', className)}>
	<CardHeader>
		<CardTitle>File Manipulation</CardTitle>
		<CardDescription>Manipulation file</CardDescription>
	</CardHeader>
	<CardContent class="grid gap-4">
		<div class="grid grid-cols-2 gap-2">
			<Button variant="outline">Zip</Button>
			<Button variant="outline">Unzip</Button>
			<Button variant="outline">Image to PDF</Button>
			<Button variant="outline">PDF to Image</Button>
			<Button variant="outline">Split PDF</Button>
		</div>
		<div class="grid gap-2">
			<CardTitle>Change Image Extension</CardTitle>
			<CardDescription>Manipulation file</CardDescription>
			<div class="grid grid-cols-2 gap-2">
				<div class="grid gap-1">
					<Form.Field {form} name="quality">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quality</Form.Label>
								<Input type="number" {...props} bind:value={$formData.quality} />
							{/snippet}
						</Form.Control>
						<Form.Description>accept 0-100</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-1">
					<Form.Field {form} name="scale">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Scale</Form.Label>
								<Input step="0.1" type="number" {...props} bind:value={$formData.scale} />
							{/snippet}
						</Form.Control>
						<Form.Description>accept float 0-1</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
			<div class="grid gap-1">
				<Form.Field {form} name="extension">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Extension</Form.Label>
							<Select.Root type="single" bind:value={$formData.extension}>
								<Select.Trigger class="w-full" {...props}>
									{$formData.extension ? $formData.extension : 'Select a verified extension'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="png">png</Select.Item>
									<Select.Item value="jpg">jpg</Select.Item>
									<Select.Item value="webp">webp</Select.Item>
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.Description>
						Selected output extension
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Button>Change Extension</Button>
		</div>
	</CardContent>
</Card>
