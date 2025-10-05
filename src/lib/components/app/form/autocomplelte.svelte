<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { ClassValue } from 'tailwind-variants';


	const { class: className, id,templates = [] }: { class?: ClassValue; id?: string,templates?:{value:string,label:string}[] } = $props();

	let open = $state(false);
	let value = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);
	let width = $derived(
		(open && triggerRef?.clientWidth) || (triggerRef && triggerRef?.clientWidth) ? triggerRef?.clientWidth + 'px' : undefined
	);

	const selectedValue = $derived(templates.find((f) => f.value === value)?.label);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<div class="relative w-full">
	<Popover.Root bind:open >
		<Popover.Trigger bind:ref={triggerRef} class="w-full" >
			{#snippet child({ props })}
				<Button
					variant="outline"
					{...props}
					role="combobox"
					class={cn('w-full justify-between text-start', className)}
					aria-expanded={open}
					{id}
				>
					{selectedValue || 'Select a template...'}
					<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger> 
		<Popover.Content class={cn("h-fit w-auto p-0",width&&`w-[${width}]`)} style={{ width:width }}>
			<Command.Root style={{ width:width }} >
				<Command.Input placeholder="Search template..." />
				<Command.List >
					<Command.Empty>No template found.</Command.Empty>
					<Command.Group>
						{#each templates as template,i (`${template.value}-${i}`)}
							<Command.Item
								value={template.value}
								onSelect={() => {
									value = template.value;
									closeAndFocusTrigger();
								}}
							>
								<CheckIcon
									class={cn('mr-2 size-4', value !== template.value && 'text-transparent')}
								/>
								{template.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>
