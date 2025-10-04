<script lang="ts">
    import { Paperclip } from 'lucide-svelte';

    const {
        file
    }: {
        file: File;
    } = $props();
</script>

<div class="mt-2 flex items-center gap-2 rounded-md border p-2">
    <Paperclip class="h-8 w-8" />
    <div class="flex flex-col">
        <span class="font-semibold">{file.name}</span>
        <span class="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</span>
    </div>
</div>
