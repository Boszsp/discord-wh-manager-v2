<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import ServerPageHeader from '$lib/components/app/server/server-page-header.svelte';
	import ServerList from '$lib/components/app/server/server-list.svelte';
	import type { Server } from '$lib/components/app/types';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { SearchIcon } from 'lucide-svelte';
	import DeleteServerDialog from '$lib/components/app/server/delete-server-dialog.svelte';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';

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

	function createServer({ name }: { name: string }) {
		servers.unshift({ id: crypto.randomUUID(), name: name });
	}

	function saveServer({ id, name, color }: { id: string; name: string; color: string }) {
		const index = servers.findIndex((s) => s.id === id);
		if (index !== -1) {
			servers[index].name = name;
			servers[index].color = color;
		}
	}

	function deleteServer({ id }: { id: string }) {
		serverToDelete = servers.find((s) => s.id === id) ?? null;
		isDeleteDialogOpen = true;
	}

	function confirmDelete() {
		if (serverToDelete) {
			servers = servers.filter((s) => s.id !== serverToDelete!.id);
		}
	}
</script>

<PageTransition />
<DashboardContainer class="bg-background">
	<ServerPageHeader onCreateServer={createServer} />
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

			<ServerList servers={filteredServers} onSave={saveServer} onDelete={deleteServer} />
		</Card.Content>
	</div>
</DashboardContainer>

<DeleteServerDialog bind:open={isDeleteDialogOpen} bind:serverToDelete onConfirm={confirmDelete} />
