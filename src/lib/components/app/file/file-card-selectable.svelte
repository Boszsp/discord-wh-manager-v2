<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import type { ClassValue } from 'svelte/elements';
	import { selectedFileStore } from './selected-file-store.svelte';
	import { cn } from '$lib/utils';

	let {
		id,
		title,
		description,
		class: className
	}: {
		title: string;
		description: string;
		id: string;
		class?: ClassValue;
	} = $props();
	let count = $state(0);

	function clickHandler() {
		if (count === 0) {
			const tempSet = new Set($selectedFileStore);
			if (tempSet.has(id)) tempSet.delete(id);
			else tempSet.add(id);
			$selectedFileStore = [...tempSet];
			count += 1;
			return
		} else {
			count = 0;
			return
		}
	}
</script>
{#key $selectedFileStore}
	

<Label
	class={cn(
		'flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-indigo-600',
		'has-[[aria-checked=true]]:bg-indigo-50 dark:has-[[aria-checked=true]]:border-indigo-900 dark:has-[[aria-checked=true]]:bg-indigo-950',
		'has-[[aria-checked=mixed]]:border-indigo-600 has-[[aria-checked=mixed]]:bg-indigo-50 dark:has-[[aria-checked=mixed]]:border-indigo-900 dark:has-[[aria-checked=mixed]]:bg-indigo-950',

		className
	)}
	aria-label={id}
	onclick={clickHandler}
>
	<Checkbox
		id="toggle-2"
		checked={$selectedFileStore.includes(id)}
		value={id}
		class="data-[state=checked]:border-secondary data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white dark:data-[state=checked]:border-indigo-700 dark:data-[state=checked]:bg-indigo-700"
	/>
	<div class="grid gap-1.5 font-normal">
		<p class="text-sm leading-none font-medium">{title}</p>
		<p class="text-xs text-muted-foreground">
			{description}
		</p>
	</div>
</Label>
{/key}