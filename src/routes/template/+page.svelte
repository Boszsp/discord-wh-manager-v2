<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	import { templateShema, type templateShemaType } from '$lib/schema/templateShema';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import * as Dialog from '$lib/components/ui/dialog';
	import TemplateForm from '$lib/components/app/template/template-form.svelte';
	import templateStore from '$lib/store/template.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import TemplatePreview from '$lib/components/app/template/template-preview.svelte';

	let open = $state(false);
	let isEditing = $state(false);
	let selectedTemplate: templateShemaType | null = $state(null);

	const form = superForm( { name: '', content: '' }, {
		validators: zod4(templateShema)
	});

	const { form: formData, enhance, message } = form;

	function openCreateDialog() {
		isEditing = false;
		selectedTemplate = null;
		$formData.name = '';
		$formData.content = '';
		open = true;
	}

	function openEditDialog(template: templateShemaType) {
		isEditing = true;
		selectedTemplate = template;
		$formData.name = template.name;
		$formData.content = template.content;
		open = true;
	}

	function handleSubmit() {
		if (isEditing && selectedTemplate) {
			templateStore.update((templates) => {
				const index = templates.findIndex((t) => t.name === selectedTemplate!.name);
				if (index !== -1) {
					templates[index] = { ...$formData };
				}
				return templates;
			});
		} else {
			templateStore.update((templates) => [...templates, { ...$formData }]);
		}
		open = false;
	}

	function deleteTemplate(template: templateShemaType) {
		templateStore.update((templates) => templates.filter((t) => t.name !== template.name));
	}
</script>

<DashboardContainer>
	<div class="p-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">Templates</h1>
			<Button onclick={openCreateDialog}>
				<PlusIcon class="mr-2" />
				Create Template
			</Button>
		</div>

		<div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each $templateStore as template (template.name)}
				<Card>
					<CardHeader>
						<CardTitle>{template.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="line-clamp-3 text-sm text-muted-foreground">
							{template.content}
						</p>
						<div class="mt-4 flex justify-end gap-2">
							<Button variant="outline" size="sm" onclick={() => openEditDialog(template)}
								>Edit</Button
							>
							<Button variant="destructive" size="sm" onclick={() => deleteTemplate(template)}
								>Delete</Button
							>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		{#if $templateStore.length > 0}
			<div class="mt-8">
				<h2 class="text-xl font-bold">Template Previews</h2>
				<div class="mt-4 grid gap-4 md:grid-cols-2">
					{#each $templateStore as template (template.name)}
						<TemplatePreview {template} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</DashboardContainer>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{isEditing ? 'Edit' : 'Create'} Template</Dialog.Title>
		</Dialog.Header>
		<TemplateForm {form} onsubmit={handleSubmit} />
	</Dialog.Content>
</Dialog.Root>
