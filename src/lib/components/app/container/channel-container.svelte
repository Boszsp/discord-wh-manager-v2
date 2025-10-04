<script lang="ts">
    import * as Resizable from "$lib/components/ui/resizable";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import ChannelSidebar from "$lib/components/app/nav/channel-sidebar.svelte";
	let { children,class:className }:{
        children:any
        class?:ClassValue
    } = $props();

</script>
 
<Resizable.PaneGroup class="h-full" direction="horizontal">
 <Resizable.Pane defaultSize={20} class="h-full">
    <ChannelSidebar/>
 </Resizable.Pane>
 <Resizable.Handle withHandle />
 <Resizable.Pane class={cn( 'relative w-fit',className)} defaultSize={78}>
    {@render children?.()}
 </Resizable.Pane>
</Resizable.PaneGroup>