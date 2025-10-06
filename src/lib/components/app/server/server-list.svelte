<script lang="ts">
    import type { Server } from '../types';
    import ServerListItem from './server-list-item.svelte';

    let { servers, onSave, onDelete }: { servers: Server[], onSave: (detail: { id: string; name: string; color: string }) => void, onDelete: (detail: { id: string }) => void } = $props();
</script>

<div class="rounded-md border">
    <div class="flex flex-col">
        {#each servers as server (server.id)}
            <ServerListItem {server} {onSave} {onDelete} />
        {/each}
    </div>
</div>
