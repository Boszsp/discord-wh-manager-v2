<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	let {
		checked = $bindable(false),
		title,
		description,
        files = $bindable([])
	}: { checked: boolean; title: string; description: string; files: File[]} = $props();
</script>

<Label
	class="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-indigo-600 has-[[aria-checked=true]]:bg-indigo-50 dark:has-[[aria-checked=true]]:border-indigo-900 dark:has-[[aria-checked=true]]:bg-indigo-950"
>
	<Checkbox
		id="toggle-2"
		bind:checked
		class="data-[state=checked]:border-secondary data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white dark:data-[state=checked]:border-indigo-700 dark:data-[state=checked]:bg-indigo-700"
	/>
	<div class="grid gap-1.5 font-normal">
		<p class="text-sm leading-none font-medium">{title}</p>
		<p class="text-sm text-muted-foreground">
			{description}
		</p>
	</div>
</Label>
