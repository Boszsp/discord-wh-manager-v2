<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import type { ServerType } from '../types';

	let { open = $bindable(false), serverToDelete = $bindable<ServerType | null>(null), onConfirm = () => {} } = $props();

	let deleteConfirmName = $state('');

	function confirmDelete() {
		if (serverToDelete && deleteConfirmName === serverToDelete.name) {
			onConfirm();
			closeDeleteDialog();
		} else {
			alert('Server name does not match.');
		}
	}

	function closeDeleteDialog() {
		serverToDelete = null;
		deleteConfirmName = '';
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Server</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			This action cannot be undone. To confirm, please type
			<span class="font-bold text-foreground">{serverToDelete?.name}</span>
			below.
		</Dialog.Description>
		<div class="grid gap-4 py-4">
			<Input
				id="delete-confirm"
				bind:value={deleteConfirmName}
				placeholder="Enter server name..."
				onkeydown={(e) => e.key === 'Enter' && confirmDelete()}
			/>
		</div>
		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="outline">Cancel</Button>
			</Dialog.Close>
			<Button onclick={confirmDelete} variant="destructive">Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
