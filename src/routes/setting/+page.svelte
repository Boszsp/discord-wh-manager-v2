<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { createChannelAction, getChannelsAction } from '$lib/curdFn/channel';
	import { createServerAction, getServersAction } from '$lib/curdFn/server';
	import { createTemplateAction, getTemplatesAction } from '$lib/curdFn/template';
	import type { ExportData, OldChannel } from '$lib/types/import-export';
	import { toast } from 'svelte-sonner';

	let files: FileList;

	async function importData() {
		const file = files[0];
		if (!file) {
			toast.error('Please select a file to import.');
			return;
		}

		const reader = new FileReader();
		reader.onload = async (event) => {
			try {
				const json = JSON.parse(event.target?.result as string);

				if (Array.isArray(json) && json.every((item) => 'link' in item)) {
					// Old format
					const oldData = json as OldChannel[];
					const serverResponse = await createServerAction({
						name: 'Imported Server',
						color: '#ffffff'
					});
					if (serverResponse.status !== 200) {
						toast.error('Failed to create server for old data.');
						return;
					}
					const serverId = serverResponse.serverId;
					for (const channel of oldData) {
						await createChannelAction(serverId, { name: channel.name, url: channel.link });
					}
				} else {
					// New format
					const data = json as ExportData;
					for (const server of data.servers) {
						const serverResponse = await createServerAction({
							name: server.name,
							color: server.color
						});
						if (serverResponse.status !== 200) continue;
						const serverId = serverResponse.serverId;
						const serverChannels = data.channels.find((c) => c.serverId === server.id);
						if (serverChannels) {
							for (const channel of serverChannels.channels) {
								await createChannelAction(serverId, { name: channel.name, url: channel.url });
							}
						}
					}
					for (const template of data.templates) {
						await createTemplateAction({ name: template.name, content: template.content });
					}
				}

				toast.success('Data imported successfully!');
			} catch (error) {
				toast.error('Invalid JSON file.');
				console.error(error);
			}
		};
		reader.readAsText(file);
	}

	async function exportData() {
		try {
			const servers = await getServersAction();
			const templates = await getTemplatesAction();
			const channels = await Promise.all(
				servers.map(async (server) => {
					const serverChannels = await getChannelsAction(server.id);
					return { serverId: server.id, channels: serverChannels };
				})
			);

			const dataToExport = {
				servers,
				templates,
				channels
			};

			const dataStr = JSON.stringify(dataToExport, null, 2);
			const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

			const exportFileDefaultName = 'discord-wh-manager-data.json';

			const linkElement = document.createElement('a');
			linkElement.setAttribute('href', dataUri);
			linkElement.setAttribute('download', exportFileDefaultName);
			linkElement.click();
			toast.success('Data exported successfully!');
		} catch (error) {
			toast.error('Failed to export data.');
			console.error(error);
		}
	}
</script>

<PageTransition />
<DashboardContainer>
	<div class="p-4">
		<h1 class="mb-4 text-2xl font-bold">Settings</h1>

		<div class="space-y-4">
			<div>
				<h2 class="text-lg font-semibold">Import Data</h2>
				<p class="text-sm text-muted-foreground">
					Import data from a JSON file. This will overwrite existing data.
				</p>
				<div class="mt-2 flex items-center space-x-2">
					<Input type="file" bind:files accept=".json" />
					<Button on:click={importData}>Import</Button>
				</div>
			</div>

			<div>
				<h2 class="text-lg font-semibold">Export Data</h2>
				<p class="text-sm text-muted-foreground">Export all your data to a JSON file.</p>
				<div class="mt-2">
					<Button on:click={exportData}>Export</Button>
				</div>
			</div>
		</div>
	</div>
</DashboardContainer>
