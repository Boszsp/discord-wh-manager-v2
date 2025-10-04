<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import ServerPageHeader from '$lib/components/app/server/server-page-header.svelte';
	import ServerList from '$lib/components/app/server/server-list.svelte';
	import type { Server } from '$lib/components/app/types';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { SearchIcon } from 'lucide-svelte';
	import DeleteServerDialog from '$lib/components/app/server/delete-server-dialog.svelte';

	let servers = $state<Server[]>([
		{ id: '1', name: 'Production Server', color: 'red' },
		{ id: '2', name: 'Staging Server', color: 'green' },
		{ id: '3', name: 'Development Server' }
	]);

	let searchTerm = $state('');
	let isDeleteDialogOpen = $state(false);
	let serverToDelete = $state<Server | null>(null);

	let filteredServers = $derived(
		servers.filter((server) => server.name.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	function createServer(event: CustomEvent<{ name: string }>) {
		servers.unshift({ id: crypto.randomUUID(), name: event.detail.name });
	}

	function saveServer(event: CustomEvent<{ id: string; name: string }>) {
		const { id, name } = event.detail;
		const index = servers.findIndex((s) => s.id === id);
		if (index !== -1) {
			servers[index].name = name;
		}
	}

	function deleteServer(event: CustomEvent<{ id: string }>) {
		const { id } = event.detail;
		serverToDelete = servers.find((s) => s.id === id) ?? null;
		isDeleteDialogOpen = true;
	}

	function confirmDelete() {
		if (serverToDelete) {
			servers = servers.filter((s) => s.id !== serverToDelete!.id);
		}
	}
</script>

<DashboardContainer class="bg-background">
	<ServerPageHeader on:createServer={createServer} />
	<div class="py-4">
		<Card.Content class="flex max-w-full flex-col gap-4">
			<div class="flex justify-between gap-2">
				<div class="relative w-full">
					<SearchIcon class="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
					<Input bind:value={searchTerm} placeholder="Search servers..." class="pl-9" />
				</div>
			</div>

			<small class="py-2 text-sm leading-none font-medium">
				All Server | เซิร์ฟเวอร์ทั้งหมด - {filteredServers?.length}
			</small>

			<ServerList servers={filteredServers} on:save={saveServer} on:delete={deleteServer} />
		</Card.Content>
	</div>
</DashboardContainer>

<DeleteServerDialog bind:open={isDeleteDialogOpen} bind:serverToDelete on:confirm={confirmDelete} />