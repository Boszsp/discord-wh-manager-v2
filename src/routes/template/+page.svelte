<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { PlusIcon } from "lucide-svelte";
    import { templateShema, type templateShemaType } from "$lib/schema/templateShema";
    import { superForm } from "sveltekit-superforms/client";
    import { zod4 } from "sveltekit-superforms/adapters";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import templateStore from "$lib/store/template.svelte.ts";

    let open = $state(false);
    let isEditing = $state(false);
    let selectedTemplate: templateShemaType | null = $state(null);

    const form = superForm(selectedTemplate ?? { name: "", content: "" }, {
        validators: zod4(templateShema),
    });

    const { form: formData, enhance, errors } = form;

    function openCreateDialog() {
        isEditing = false;
        selectedTemplate = null;
        $formData.name = "";
        $formData.content = "";
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
            // Edit existing template
            templateStore.update(templates => {
                const index = templates.findIndex(t => t.name === selectedTemplate!.name);
                if (index !== -1) {
                    templates[index] = { ...$formData };
                }
                return templates;
            });
        } else {
            // Create new template
            templateStore.update(templates => [...templates, { ...$formData }]);
        }
        open = false;
    }

    function deleteTemplate(template: templateShemaType) {
        templateStore.update(templates => templates.filter(t => t.name !== template.name));
    }

</script>

<div class="p-4">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Templates</h1>
        <Button onclick={openCreateDialog}>
            <PlusIcon class="mr-2" />
            Create Template
        </Button>
    </div>

    <div class="mt-4 grid gap-4">
        {#each $templateStore as template (template.name)}
            <div class="rounded-lg border p-4">
                <h2 class="text-lg font-semibold">{template.name}</h2>
                <p class="mt-2 text-sm text-muted-foreground">{template.content}</p>
                <div class="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onclick={() => openEditDialog(template)}>Edit</Button>
                    <Button variant="destructive" size="sm" onclick={() => deleteTemplate(template)}>Delete</Button>
                </div>
            </div>
        {/each}
    </div>
</div>

<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>{isEditing ? "Edit" : "Create"} Template</Dialog.Title>
        </Dialog.Header>
        <form onsubmit={handleSubmit} use:enhance>
            <Form.Field {form} name="name" class="mb-4">
                <Form.Control let:attrs>
                    <Form.Label>Name</Form.Label>
                    <Input {...attrs} bind:value={$formData.name} placeholder="Template Name" />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="content">
                <Form.Control let:attrs>
                    <Form.Label>Content</Form.Label>
                    <Textarea {...attrs} bind:value={$formData.content} placeholder="Hello {{name}}" class="min-h-[200px]" />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            <Dialog.Footer class="mt-4">
                <Button type="submit">{isEditing ? "Save" : "Create"}</Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
