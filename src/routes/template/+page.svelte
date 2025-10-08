<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import { Button } from '$lib/components/ui/button';
	import { LayoutTemplateIcon, PlusIcon } from 'lucide-svelte';
	import { templateShema, type templateShemaType } from '$lib/schema/templateShema';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import * as Dialog from '$lib/components/ui/dialog';
	import TemplateForm from '$lib/components/app/template/template-form.svelte';
	import {templateStore} from '$lib/store/template.svelte';
	import TemplatePreview from '$lib/components/app/template/template-preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { CardTitle } from '$lib/components/ui/card';
	import type { PageProps } from './$types';

	const {data}: PageProps = $props()
	let open = $state(false);
	let isEditing = $state(false);
	let selectedTemplate: templateShemaType | null = $state(null);

	const form = superForm(
		{ name: '', content: '' },
		{
			validators: zod4(templateShema)
		}
	);

	const { form: formData, enhance, message } = form;

	function openCreateDialog() {
		isEditing = false;
		selectedTemplate = null;
		$formData.name = '';
		$formData.content = '{"content":""}';
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
	<ScrollArea class="h-full w-full overflow-hidden bg-background">
		<div class=" ">
			<div class="m-0 inline-flex w-full items-center-safe gap-4 border-b px-4 py-2 sticky top-0 bg-background z-10 ">
				<span class="inline-flex gap-2">
					<LayoutTemplateIcon class="size-4" />
					<CardTitle>Manage Templates</CardTitle>
				</span>
				<Button variant="outline" size="sm" onclick={openCreateDialog} >New With Json</Button>
			</div>
			<h3 class="mb-4 mt-4 px-4 text-lg font-medium">Available Templates</h3>

			{#if data?.templates.length > 0}
				<div class="px-4 mb-8">
					<div class="flex flex-col gap-4">
						{#each data?.templates as template (template.name)}
							<TemplatePreview {template} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</ScrollArea>
</DashboardContainer>

<Dialog.Root bind:open>
	<Dialog.Content class="overflow-hidden max-w-full min-w-fit">
		<Dialog.Header>
			<Dialog.Title>{isEditing ? 'Edit' : 'Create'} Template</Dialog.Title>
		</Dialog.Header>
		<TemplateForm {form} onsubmit={handleSubmit} />
	</Dialog.Content>
</Dialog.Root>
