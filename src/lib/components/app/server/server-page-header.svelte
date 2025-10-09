<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ServerIcon } from 'lucide-svelte';
	import CreateServerDialog from './create-server-dialog.svelte';

	let { onCreateServer }: { onCreateServer: (detail: { name: string,color:string }) => void } = $props();
</script>

<div class="m-0 inline-flex w-full items-center-safe gap-4 border-b px-4 py-2">
	<span class="inline-flex gap-2">
		<ServerIcon class="size-4" />
		<Card.Title>Manage Servers</Card.Title>
	</span>
	<CreateServerDialog {onCreateServer} />
</div>
