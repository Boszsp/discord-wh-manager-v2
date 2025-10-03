<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { LayoutTemplateIcon,ServerIcon,CogIcon } from 'lucide-svelte';
	import { page } from '$app/state';

</script>

<nav>
	<div class="border-b p-2">
		<CardTitle class="mx-auto text-center p-2 bg-secondary rounded-md">Home Page</CardTitle>
	</div>
	<ScrollArea class="h-full px-4 pt-2">
		<Button onclick={()=>goto('/server')} variant={page.route.id === "/server" ? "secondary": "ghost"} class="w-full text-start justify-start"><ServerIcon/>Server</Button>
		<Button onclick={()=>goto('/template')} variant={page.route.id === "/template" ? "secondary": "ghost"} class="w-full text-start justify-start"><LayoutTemplateIcon/>Template</Button>
		<Button onclick={()=>goto('/setting')} variant={page.route.id === "/setting" ? "secondary": "ghost"} class="w-full text-start justify-start"><CogIcon/>Setting</Button>

	</ScrollArea>
</nav>
