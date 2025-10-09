<script lang="ts">
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { TrashIcon, AlertTriangleIcon } from 'lucide-svelte';
    import { cn } from '$lib/utils';

    let {
        channel = { name: '', url: '', id: '' },
        onRemoveChannel = (id: string) => {},
        triggerType = 'icon' // 'button' or 'icon'
    }: { 
        channel: { name: string, url: string, id?: string },
        onRemoveChannel: (id: string) => void,
        triggerType?: 'button' | 'icon'
    } = $props();

    let open = $state(false);

    function removeChannel() {
        if (channel.id) {
            onRemoveChannel(channel.id);
            open = false;
        }
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger 
        class={cn(
            buttonVariants({ size: 'sm', variant: 'ghost' }), 
            triggerType === 'icon' ? 'p-0' : ''
        )}
    >
        {#if triggerType === 'icon'}
            <TrashIcon class="size-4" />
        {:else}
            <TrashIcon class="mr-2 size-4" />
            Remove Channel
        {/if}
    </Dialog.Trigger>
    <Dialog.Content class="w-md">
        <Dialog.Header>
            <Dialog.Title class="mx-auto w-fit flex items-center gap-2">
                <AlertTriangleIcon class="size-5 text-destructive" />
                Remove Channel
            </Dialog.Title>
            <Dialog.Description class="mx-auto">
                Are you sure you want to remove this channel?
            </Dialog.Description>
        </Dialog.Header>
        <div class="py-4">
            <div class="rounded-md bg-muted p-3">
                <p class="font-medium">{channel.name}</p>
                <p class="text-sm text-muted-foreground truncate">{channel.url}</p>
            </div>
            <p class="text-sm text-muted-foreground mt-2">
                This action cannot be undone. This will permanently delete the channel.
            </p>
        </div>
        <Dialog.Footer>
            <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
            <Button variant="destructive" onclick={removeChannel}>Remove</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
