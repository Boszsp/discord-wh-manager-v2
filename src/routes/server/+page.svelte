<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import ServerPageHeader from '$lib/components/app/server/server-page-header.svelte';
	import ServerList from '$lib/components/app/server/server-list.svelte';
	import type { ServerType } from '$lib/components/app/types';
	import { Input } from '$lib/components/ui/input';
	import { SearchIcon } from 'lucide-svelte';
	import DeleteServerDialog from '$lib/components/app/server/delete-server-dialog.svelte';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';
	import type { PageProps } from './$types';
	import { CardContent } from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { createServerAction, editServerAction, removeServerAction } from '$lib/curdFn/server';
	import { channelCurId } from '$lib/store/channel.svelte';
	import consola from 'consola';

	const { data }: PageProps = $props();

	let servers: ServerType[] = $state(data.servers ?? []);

	let searchTerm = $state('');
	let isDeleteDialogOpen = $state(false);
	let serverToDelete = $state<ServerType | null>(null);
	let deleteTarget = $state('');

	let filteredServers = $derived(
		servers.filter((server) => server.title.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	function createServer({ name, color }: { name: string; color: string }) {
		createServerAction({ name, color })
			.then((v) => {
				if (v?.affectedServer) {
					servers?.unshift({
						id: v?.serverId || '',
						title: v?.affectedServer?.name || '',
						color: v?.affectedServer?.color || ''
					});
				}
				toast.success('Server created successfully');
			})
			.catch((e) => {
				consola.error(e);
				toast.error(e.message);
			});
	}

	function saveServer({ id, name, color }: { id: string; name: string; color: string }) {
		const index = servers?.findIndex((s) => s.id === id);
		editServerAction(id, { name, color })
			.then((r) => {
				if (index !== -1 && r.affectedServer) {
					servers = servers.filter((s) => s.id !== id);
					servers = servers.concat([
						{
							id: (r.serverId + '') as string,
							title: (r.affectedServer?.name + '') as string,
							color:
								(r.affectedServer?.color === null
									? undefined
									: r.affectedServer?.color) as string | undefined
						}
					]);
					//servers[index].title = r.affectedServer?.name;
					//servers[index].color = r.affectedServer?.color || '';
				}
				toast.success('Server saved successfully');
			})
			.catch((e) => {
				consola.error(e);
				toast.error(e.message);
			});
	}

	function deleteServer({ id }: { id: string }) {
		//console.log(id)
		serverToDelete = servers?.find((s) => s.id === id) ?? null;
		isDeleteDialogOpen = true;
		//console.log(serverToDelete)
		deleteTarget = id;
	}

	function confirmDelete() {
		if (serverToDelete) {
			removeServerAction(deleteTarget)
				.then(() => {
					serverToDelete = servers.find((s) => s.id === deleteTarget) ?? null;
					servers = servers.filter((s) => s.id !== deleteTarget);
					toast.success('Server deleted successfully');
				})
				.catch((e) => {
					consola.error(e);
					toast.error(e.message);
				})
				.finally(() => (isDeleteDialogOpen = false));
		}
	}
</script>

<PageTransition />
<DashboardContainer class="bg-background">
	<ServerPageHeader onCreateServer={createServer} />
	<div class="py-4">
		<CardContent class="flex max-w-full flex-col gap-4">
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
		</CardContent>
	</div>
</DashboardContainer>

<DeleteServerDialog bind:open={isDeleteDialogOpen} bind:serverToDelete onConfirm={confirmDelete} />
