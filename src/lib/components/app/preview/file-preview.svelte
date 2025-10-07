<script lang="ts">
    import { FileIcon } from 'lucide-svelte';

    const {
        file
    }: {
        file: File;
    } = $props();

    function handlerOpenFile() {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        setTimeout(() => {
            URL.revokeObjectURL(fileURL);
        }, 1000 * 5); // Revoke after 5 seconds
    }
</script>

<button onclick={handlerOpenFile} class="mt-2 flex items-center gap-2 rounded-md border p-4 bg-card outline-none text-start w-fit">
    <FileIcon class="size-10 text-muted-foreground" strokeWidth={2} />
    <div class="flex flex-col mr-24">
        <span class="text-blue-400 truncate font-light">{file.name}</span>
        <span class="text-xs text-muted-foreground font-light">{Math.round(file.size / 1024)} KB</span>
    </div>
</button>
