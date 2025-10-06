<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { templateShemaType } from '$lib/schema/templateShema';
	import { RefreshCcw } from 'lucide-svelte';

	let {
		template
	}: {
		template: templateShemaType;
	} = $props();

	let variables = $state<Record<string, string>>({});
	let preview = $state(template.content);

	// Extract variables from template content
	$effect(() => {
		const matches = template.content.match(/\{([^}]+)\}/g) || [];
		const varNames = matches.map((match) => match.slice(1, -1));
		const newVars: Record<string, string> = {};
		varNames.forEach((name) => {
			newVars[name] = variables[name] || '';
		});
		variables = newVars;
	});

	// Update preview when template or variables change
	$effect(() => {
		let result = template.content;
		Object.entries(variables).forEach(([key, value]) => {
			result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
		});
		preview = result;
	});
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between">
			<div>
				<CardTitle>{template.name}</CardTitle>
				<CardDescription>Fill in the variables to preview the template</CardDescription>
			</div>
			<Button
				variant="outline"
				size="icon"
				onclick={() => {
					variables = Object.fromEntries(Object.keys(variables).map((key) => [key, '']));
				}}
			>
				<RefreshCcw class="size-4" />
			</Button>
		</div>
	</CardHeader>
	<CardContent>
		<div class="flex flex-col gap-6">
			{#if Object.keys(variables).length > 0}
				<div class="grid gap-4 sm:grid-cols-2">
					{#each Object.entries(variables) as [name, value]}
						<div class="flex flex-col gap-2">
							<label for={name} class="text-sm font-medium">{name}</label>
							<Input id={name} bind:value={variables[name]} placeholder="Enter value..." />
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">This template has no variables to fill.</p>
			{/if}

			<div class="flex flex-col gap-2">
				<h4 class="text-sm font-medium">Preview</h4>
				<div class="rounded-md border p-4">
					<pre class="text-sm whitespace-pre-wrap">{preview}</pre>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
