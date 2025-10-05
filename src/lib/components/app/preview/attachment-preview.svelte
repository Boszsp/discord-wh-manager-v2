<script lang="ts">
    import ImagePreview from './image-preview.svelte';
    import FilePreview from './file-preview.svelte';

    const {
        attachments
    }: {
        attachments: (string | File)[];
    } = $props();

    const images = attachments.filter(isImage);
    const files = attachments.filter(isntImage);

    function isImage(attachment: string | File): boolean {
        if (typeof attachment === 'string') {
            return attachment.match(/\.(jpeg|jpg|gif|png)$/) != null;
        }
        return attachment.type.startsWith('image/');
    }

    function isntImage(attachment: string | File): boolean {
        return !isImage(attachment);
    }
</script>

{#if images.length > 0}
    <ImagePreview images={images} />
{/if}

{#each files as file,i ('attachment-preview-'+i)}
    {#if typeof file !== 'string'}
        <FilePreview file={file} />
    {/if}
{/each}
