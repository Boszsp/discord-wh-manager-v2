<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboardContainer.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardDescription,
		CardHeader,
		CardTitle,
		CardContent
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogClose
	} from '$lib/components/ui/dialog';
	import { Trash2Icon, PencilIcon, SaveIcon, SearchIcon, PlusIcon } from 'lucide-svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { fly } from 'svelte/transition';

	type Server = {
		id: string;
		name: string;
	};

	// Dummy data for servers, now using $state
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

	// Use $derived for computed values
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
		if (event.key === 'Enter') {
			saveEdit();
		} else if (event.key === 'Escape') {
			cancelEdit();
		}
	}

	function createServer() {
		if (!newServerName) return;
		servers.push({
			id: crypto.randomUUID(),
			name: newServerName
		});
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

<DashboardContainer class="p-8">
	<Card>
		<CardHeader>
			<CardTitle>Manage Servers</CardTitle>
			<CardDescription>A list of your servers.</CardDescription>
		</CardHeader>
		<CardContent class="flex flex-col gap-4">
			<div class="flex justify-between gap-2">
				<div class="relative w-full max-w-sm">
					<SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						bind:value={searchTerm}
						placeholder="Search servers..."
						class="pl-9"
					/>
				</div>
				<Dialog bind:open={isCreateDialogOpen}>
					<DialogTrigger asChild let:builder>
						<Button builders={[builder]}>
							<PlusIcon class="mr-2 h-4 w-4" />
							Create Server
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Server</DialogTitle>
						</DialogHeader>
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="new-server-name" class="text-right">Name</Label>
								<Input
									id="new-server-name"
									bind:value={newServerName}
									class="col-span-3"
									onkeydown={(e) => e.key === 'Enter' && createServer()}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button onclick={createServer}>Create</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div class="rounded-md border">
				<div class="flex flex-col">
					{#each filteredServers as server (server.id)}
						<div
							class="flex items-center gap-4 p-4 border-b last:border-b-0"
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
		</CardContent>
	</Card>
</DashboardContainer>

<Dialog bind:open={isDeleteDialogOpen}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Delete Server</DialogTitle>
			<DialogDescription>
				This action cannot be undone. To confirm, please type
				<span class="font-bold text-foreground">{serverToDelete?.name}</span>
				below.
			</DialogDescription>
		</DialogHeader>
		<div class="grid gap-4 py-4">
			<Input
				id="delete-confirm"
				bind:value={deleteConfirmName}
				placeholder="Enter server name..."
				onkeydown={(e) => e.key === 'Enter' && confirmDelete()}
			/>
		</div>
		<DialogFooter>
			<DialogClose asChild let:builder>
				<Button builders={[builder]} variant="outline">Cancel</Button>
			</DialogClose>
			<Button onclick={confirmDelete} variant="destructive">Delete</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>