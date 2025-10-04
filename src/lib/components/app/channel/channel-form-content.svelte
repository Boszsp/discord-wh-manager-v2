<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import { Textarea } from '$lib/components/ui/textarea';
	let {
		class: className,
		form
	}: {
		class?: ClassValue;
		form: SuperForm<hookJsonPartialSchemaType, any>;
	} = $props();
	const { form: formData } = form;
</script>

<Form.Field {form} name="content">
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label class="inline-flex w-full justify-between"
				><span class="w-full">Content</span><span class="text-sm font-light text-muted-foreground"
					>{$formData.content?.length}/2000</span
				></Form.Label
			>
			<Textarea {...props} bind:value={$formData.content} class="h-32" />
		{/snippet}
	</Form.Control>
	<Form.Description />
	<Form.FieldErrors />
</Form.Field>
