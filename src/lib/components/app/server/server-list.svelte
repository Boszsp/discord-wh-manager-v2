<script lang="ts">
    import type { Server } from '../types';
    import ServerListItem from './server-list-item.svelte';

    let { servers }: { servers: Server[] } = $props();
</script>

<div class="rounded-md border">
    <div class="flex flex-col">
        {#each servers as server (server.id)}
            <ServerListItem {server} on:save on:delete />
        {/each}
    </div>
</div>
