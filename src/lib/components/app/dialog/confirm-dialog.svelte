<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { TrashIcon, AlertTriangleIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { consola } from 'consola';
	import { toast } from 'svelte-sonner';

	let {
		title = 'Confirm',
		description = 'Are you sure you want to action this item?',
		itemName = '',
		itemDetails = '',
		confirmText = 'Action',
		cancelText = 'Cancel',
		onConfirm = () => {},
		triggerType = 'icon', // 'button' or 'icon' or 'custom'
		triggerClass = '',
		variant = 'destructive', // 'destructive' or 'default'
		disabled = false,
		open = $bindable(false)
	}: {
		title?: string;
		description?: string;
		itemName?: string;
		itemDetails?: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm?: () => void;
		triggerType?: 'button' | 'icon' | 'custom';
		triggerClass?: string;
		variant?: 'destructive' | 'default';
		disabled?: boolean;
		open?: boolean;
	} = $props();

	function handleConfirm() {
		try {
			onConfirm();
			open = false;
		} catch (err: any) {
			consola.error(err);
			toast.error(err.message);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(
			triggerType === 'icon' ? 'p-0' : '',
			triggerType === 'button'
				? 'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
				: '',
			variant === 'destructive'
				? 'text-destructive hover:bg-destructive/10'
				: 'hover:bg-accent hover:text-accent-foreground',
			triggerClass
		)}
		{disabled}
	>
		{#if triggerType === 'icon'}
			<TrashIcon class="size-4" />
		{:else if triggerType === 'button'}
			<TrashIcon class="mr-2 size-4" />
			Remove
		{:else}
			{#snippet trigger()}
			{/snippet}
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="w-md">
		<Dialog.Header>
			<Dialog.Title>
				{title}
			</Dialog.Title>
			<Dialog.Description >
				{description}
			</Dialog.Description>
		</Dialog.Header>

		{#if itemName || itemDetails}
			<div class="py-4">
				{#if itemName}
					<div class="rounded-md bg-muted p-3">
						<p class="font-medium">{itemName}</p>
						{#if itemDetails}
							<p class="mt-1 truncate text-sm text-muted-foreground">{itemDetails}</p>
						{/if}
					</div>
				{/if}
				<p class="mt-2 text-center text-sm text-muted-foreground">This action cannot be undone.</p>
			</div>
		{/if}

		<Dialog.Footer >
			<Button variant="outline" onclick={() => (open = false)}>
				{cancelText}
			</Button>
			<Button {variant} onclick={handleConfirm}>
				{confirmText}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
