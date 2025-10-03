<script lang="ts">
    import * as Resizable from "$lib/components/ui/resizable";
	import type { ClassValue } from "svelte/elements";
	import InnerSidebar from "../nav/innerSidebar.svelte";
	import { cn } from "$lib/utils";
	let { children,class:className }:{
        children:any
        class?:ClassValue
    } = $props();

</script>
 
<Resizable.PaneGroup class="h-full" direction="horizontal">
 <Resizable.Pane defaultSize={22} class="h-full">
    <InnerSidebar/>
 </Resizable.Pane>
 <Resizable.Handle  />
 <Resizable.Pane class={cn( 'relative w-fit',className)} defaultSize={78}>
    {@render children?.()}
 </Resizable.Pane>
</Resizable.PaneGroup>