<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import type { ClassValue } from 'svelte/elements';
	import { selectedFileStore } from './selected-file-store.svelte';
	import { cn } from '$lib/utils';

	let {
		id,
		checked = $bindable(false),
		title,
		description,
		class: className
	}: {
		checked?: boolean;
		title: string;
		description: string;
		id: string;
		class?: ClassValue;
	} = $props();

	function checkHandler(id: string) {
		selectedFileStore.update((v) => {
			const tempSet = new Set(v);
			tempSet.add(id);
			return [...tempSet];
		});
	}
	function unCheck(id: string) {
		selectedFileStore.update((v) => {
			const tempSet = new Set(v);
			tempSet.delete(id);
			return [...tempSet];
		});
	}

	$effect(() => {
		if (checked) {
			checkHandler(id);
		} else {
			unCheck(id);
		}
	});
</script>

<Label
	class={cn(
		'flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-indigo-600',
		'has-[[aria-checked=true]]:bg-indigo-50 dark:has-[[aria-checked=true]]:border-indigo-900 dark:has-[[aria-checked=true]]:bg-indigo-950',
		className
	)}
>
	<Checkbox
		id="toggle-2"
		bind:checked
		value={id}
		class="data-[state=checked]:border-secondary data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white dark:data-[state=checked]:border-indigo-700 dark:data-[state=checked]:bg-indigo-700"
	/>
	<div class="grid gap-1.5 font-normal">
		<p class="text-sm leading-none font-medium">{title}</p>
		<p class="text-sm text-muted-foreground">
			{description}
		</p>
	</div>
</Label>
