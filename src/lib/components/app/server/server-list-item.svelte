<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Avatar from '$lib/components/ui/avatar';
	import { PencilIcon, SaveIcon, Trash2Icon, XIcon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import type { Server } from '../types';
	import { createEventDispatcher } from 'svelte';
	import { convertToFallbackString } from '$lib/utilsFn/string';
	import { colorNameToHex } from '$lib/utilsFn/color';

	const dispatch = createEventDispatcher();

	let { server }: { server: Server } = $props();

	let editingName = $state('');
	let isEditing = $state(false);

	function startEditing() {
		isEditing = true;
		editingName = server.name;
	}

	function saveEdit() {
		if (!editingName) return;
		dispatch('save', { id: server.id, name: editingName });
		cancelEdit();
	}

	function cancelEdit() {
		isEditing = false;
		editingName = '';
	}

	function handleEditKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') saveEdit();
		else if (event.key === 'Escape') cancelEdit();
	}

	function deleteServer() {
		dispatch('delete', { id: server.id });
	}
</script>

<div class="flex items-center gap-4 border-b p-4 last:border-b-0" in:fly={{ y: 20, duration: 300 }}>
	{#if isEditing}
		<div class="relative size-10 overflow-hidden rounded-xl border border-dashed">
			<Input
				type="color"
				value={colorNameToHex(server.color ?? 'black')}
				class="size-10 scale-[200] bg-transparent "
			/>
		</div>
		<Input bind:value={editingName} onkeydown={handleEditKeydown} class="flex-1" autofocus />
		<Button onclick={() => (isEditing = false)} size="icon" variant="secondary">
			<XIcon class="h-4 w-4" />
		</Button>
		<Button onclick={saveEdit} size="icon" variant="default">
			<SaveIcon class="h-4 w-4" />
		</Button>
	{:else}
		<Avatar.Root
			class={cn('text-primary-secondary size-10 rounded-xl bg-secondary/60')}
			style={{ backgroundColor: server?.color }}
		>
			<Avatar.Image src={undefined} alt="server logo" />
			<Avatar.Fallback class="scale-75 bg-transparent">
				{convertToFallbackString(server.name)}
			</Avatar.Fallback>
		</Avatar.Root>
		<p class="flex-1 font-medium">{server.name}</p>
		<Button onclick={startEditing} size="icon" variant="secondary">
			<PencilIcon class="h-4 w-4" />
		</Button>
		<Button
			onclick={deleteServer}
			size="icon"
			variant="secondary"
			class="text-destructive hover:text-destructive"
		>
			<Trash2Icon class="h-4 w-4" />
		</Button>
	{/if}
</div>
