<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import { Button } from '$lib/components/ui/button';
	import { LayoutTemplateIcon, PlusIcon } from 'lucide-svelte';
	import { templateSchema, type TemplateSchemaType } from '$lib/schema/templateSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import * as Dialog from '$lib/components/ui/dialog';
	import TemplateForm from '$lib/components/app/template/template-form.svelte';
	import { templateStore } from '$lib/store/template.svelte';
	import TemplatePreview from '$lib/components/app/template/template-preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { CardTitle } from '$lib/components/ui/card';
	import type { PageProps } from './$types';
import { createTemplateAction, editTemplateAction, removeTemplateAction } from '$lib/curdFn/template';
	import ConfirmDialog from '$lib/components/app/dialog/confirm-dialog.svelte';

	const { data }: PageProps = $props();
	let isOpenEditDialog = $state(false);
	let isOpenRemoveDialog = $state(false);
	let isEditing = $state(false);
	let templates = $state<TemplateSchemaType[]>(data?.templates);
	let selectedTemplate: TemplateSchemaType | null = $state(null);

	const form = superForm(
		{ name: '', content: '' },
		{
			validators: zod4(templateSchema),
			validationMethod: 'oninput',
			onSubmit: (inp) => {
				handleSubmit();
				inp.cancel();
				return false;
			},
			clearOnSubmit: 'errors'
		}
	);

	const { form: formData } = form;

	function openCreateDialog() {
		isEditing = false;
		selectedTemplate = null;
		$formData.name = '';
		$formData.content = '{"content":""}';
		isOpenEditDialog = true;
	}

	function onEdit(id: string, template: TemplateSchemaType) {
		editTemplateAction(id, template).then();
	}

	async function handleSubmit() {
		if (isEditing && selectedTemplate) {
			const result = await editTemplateAction(selectedTemplate?.id + "", { ...$formData, id: selectedTemplate.id });
      templates = templates.map(t => t.id === selectedTemplate!.id ? result.affectedTemplate : t);
		} else {
			const result = await createTemplateAction({ ...$formData, id: '' });
      templates = [...templates, result.affectedTemplate];
		}
		isOpenEditDialog = false;
	}

	function openRemoveDialog(templateId: string) {
		//selectedTemplate = templateId;
		selectedTemplate = templates.find((t) => t.id === templateId) || null;
		isOpenRemoveDialog = true;
	}

	function deleteTemplate() {
		removeTemplateAction(selectedTemplate?.id + "")
		templateStore.update((templates) => templates.filter((t) => t.name !== selectedTemplate?.name));
	}
</script>

<DashboardContainer>
	<ScrollArea class="h-full w-full overflow-hidden bg-background">
		<div class=" ">
			<div
				class="sticky top-0 z-10 m-0 inline-flex w-full items-center-safe gap-4 border-b bg-background px-4 py-2"
			>
				<span class="inline-flex gap-2">
					<LayoutTemplateIcon class="size-4" />
					<CardTitle>Manage Templates</CardTitle>
				</span>
				<Button variant="outline" size="sm" onclick={openCreateDialog}>Add Template</Button>
			</div>
			<h3 class="mt-4 mb-4 px-4 text-lg font-medium">Available Templates</h3>

			{#if data?.templates.length > 0}
				<div class="mb-8 px-4">
					<div class="flex flex-col gap-4">
						{#each templates as template (template.name)}
							<TemplatePreview
								{template}
								onEditTemplate={onEdit}
								onRemoveTemplate={openRemoveDialog}
							/>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</ScrollArea>
</DashboardContainer>

<Dialog.Root bind:open={isOpenEditDialog}>
	<Dialog.Content class="max-w-full min-w-fit overflow-hidden">
		<Dialog.Header class="!w-2xl">
			<Dialog.Title>Create Template</Dialog.Title>
		</Dialog.Header>
		<TemplateForm {form} />
	</Dialog.Content>
</Dialog.Root>
<ConfirmDialog
	bind:open={isOpenRemoveDialog}
	title="Remove Template"
	description="Are you sure you want to remove this template?"
	confirmText="Remove"
	itemName={selectedTemplate?.name}
	onConfirm={deleteTemplate}
/>
