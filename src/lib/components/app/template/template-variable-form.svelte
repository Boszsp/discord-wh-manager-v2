<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { extractVariables } from '$lib/utilsFn/template';

	type Values = Record<string, string>;

	let {
		templateContent = '',
		values = $bindable({})
	}: {
		templateContent: string;
		values?: Values;
	} = $props();

	const variables = $derived(extractVariables(templateContent));
</script>

<div class="space-y-4 rounded-md border p-4">
	<h3 class="text-lg font-medium">Template Variables</h3>
	{#if variables.length > 0}
		<div>
			<p class="text-sm text-muted-foreground">
				Fill in the values for the variables found in your template.
			</p>
			<div class="space-y-4 pt-4">
				{#each variables as variable}
					<div class="grid gap-2">
						<Label for={variable} class="capitalize">{variable.replace(/_/g, ' ')}</Label>
						<Input
							id={variable}
							name={variable}
							placeholder={`Enter value for ${variable}`}
							bind:value={values[variable]}
						/>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-sm text-muted-foreground">
			This template does not contain any variables to fill.
		</p>
	{/if}
</div>
