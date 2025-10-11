<script lang="ts">
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { HashIcon, TrashIcon } from 'lucide-svelte';
	
    let {
        channel = { name: '', url: '', id: '' },
        onRemoveChannel = () => {},
        triggerType = 'icon', // 'button' or 'icon'
		open = $bindable(false),
    }: { 
        channel: { name: string, url: string, id?: string },
        onRemoveChannel: () => void,
        triggerType?: 'button' | 'icon',
		open?: boolean;
    } = $props();


    function removeChannel() {
        if (channel?.id) {
            onRemoveChannel();
            open = false;
        }
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Content class="w-md">
        <Dialog.Header>
            <Dialog.Title class="mx-auto w-fit flex items-center gap-2">
                Remove Channel
            </Dialog.Title>
            <Dialog.Description class="mx-auto">
                Are you sure you want to remove this channel?
            </Dialog.Description>
        </Dialog.Header>
        <div class="py-4 overflow-hidden">
            <div class="rounded-md bg-muted p-3 flex items-center truncate">
                <span>
                    <HashIcon class="text-muted-foreground" />
                </span>
                <span class="ml-4 truncate">
                <p class="font-medium">{channel.name}</p>
                <p class="text-sm text-muted-foreground truncate">{channel.url}</p>
                </span>
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
