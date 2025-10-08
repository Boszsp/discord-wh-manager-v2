<script lang="ts">
    import type { ServerType } from '../types';
    import ServerListItem from './server-list-item.svelte';

    let { servers, onSave, onDelete }: { servers: ServerType[], onSave: (detail: { id: string; name: string; color: string }) => void, onDelete: (detail: { id: string }) => void } = $props();
</script>

<div class="rounded-md border overflow-hidden bg-theme-accent">
    <div class="flex flex-col">
        {#each servers as server , i(server.title+"-"+i)}
            <ServerListItem {server} {onSave} {onDelete} />
        {/each}
    </div>
</div>
