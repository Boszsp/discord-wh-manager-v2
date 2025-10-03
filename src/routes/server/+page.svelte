<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboardContainer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Trash2Icon, PencilIcon, SaveIcon, SearchIcon, PlusIcon } from 'lucide-svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { ServerIcon } from 'lucide-svelte';

	type Server = {
		id: string;
		name: string;
	};

	let servers = $state<Server[]>([
		{ id: '1', name: 'Production Server' },
		{ id: '2', name: 'Staging Server' },
		{ id: '3', name: 'Development Server' }
	]);

	let searchTerm = $state('');
	let editingId = $state<string | null>(null);
	let editingName = $state('');
	let serverToDelete = $state<Server | null>(null);
	let deleteConfirmName = $state('');
	let newServerName = $state('');
	let isCreateDialogOpen = $state(false);
	let isDeleteDialogOpen = $state(false);

	let filteredServers = $derived(
		servers.filter((server) => server.name.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	function startEditing(server: Server) {
		editingId = server.id;
		editingName = server.name;
	}

	function saveEdit() {
		if (!editingId || !editingName) return;
		const index = servers.findIndex((s) => s.id === editingId);
		if (index !== -1) {
			servers[index].name = editingName;
		}
		cancelEdit();
	}

	function cancelEdit() {
		editingId = null;
		editingName = '';
	}

	function handleEditKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') saveEdit();
		else if (event.key === 'Escape') cancelEdit();
	}

	function createServer() {
		if (!newServerName) return;
		servers.push({ id: crypto.randomUUID(), name: newServerName });
		newServerName = '';
		isCreateDialogOpen = false;
	}

	function openDeleteDialog(server: Server) {
		serverToDelete = server;
		isDeleteDialogOpen = true;
	}

	function confirmDelete() {
		if (serverToDelete && deleteConfirmName === serverToDelete.name) {
			servers = servers.filter((s) => s.id !== serverToDelete!.id);
			closeDeleteDialog();
		} else {
			alert('Server name does not match.');
		}
	}

	function closeDeleteDialog() {
		serverToDelete = null;
		deleteConfirmName = '';
		isDeleteDialogOpen = false;
	}
</script>

<DashboardContainer class="bg-background">
	<div class="m-0 inline-flex gap-4 w-full items-center-safe border-b px-4 py-2">
		<span class="inline-flex gap-2">
			<ServerIcon class="size-4"/>
			<Card.Title>Manage Servers</Card.Title>
		</span>
		<Dialog.Root bind:open={isCreateDialogOpen}>
			<Dialog.Trigger class={cn(buttonVariants({ size: 'sm' }), 'p-0')}>
				<PlusIcon />
				Create Server
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Create New Server</Dialog.Title>
				</Dialog.Header>
				<div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="new-server-name">Name</Label>
						<Input
							id="new-server-name"
							bind:value={newServerName}
							class="w-full"
							onkeydown={(e) => e.key === 'Enter' && createServer()}
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Button onclick={createServer}>Create</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	<div class="p-8">
		<Card.Content class="flex max-w-full flex-col gap-4">
			<div class="flex justify-between gap-2">
				<div class="relative w-full">
					<SearchIcon class="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
					<Input bind:value={searchTerm} placeholder="Search servers..." class="pl-9" />
				</div>
			</div>

			<div class="rounded-md border">
				<div class="flex flex-col">
					{#each filteredServers as server (server.id)}
						<div
							class="flex items-center gap-4 border-b p-4 last:border-b-0"
							in:fly={{ y: 20, duration: 300 }}
						>
							{#if editingId === server.id}
								<Input
									bind:value={editingName}
									onkeydown={handleEditKeydown}
									class="flex-1"
									autofocus
								/>
								<Button onclick={saveEdit} size="icon" variant="outline">
									<SaveIcon class="h-4 w-4" />
								</Button>
							{:else}
								<p class="flex-1 font-medium">{server.name}</p>
								<Button onclick={() => startEditing(server)} size="icon" variant="ghost">
									<PencilIcon class="h-4 w-4" />
								</Button>
								<Button
									onclick={() => openDeleteDialog(server)}
									size="icon"
									variant="ghost"
									class="text-destructive hover:text-destructive"
								>
									<Trash2Icon class="h-4 w-4" />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</Card.Content>
	</div>
</DashboardContainer>

<Dialog.Root bind:open={isDeleteDialogOpen}>
	<Dialog.Content>
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
