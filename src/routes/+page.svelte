<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { LayoutTemplateIcon, ServerIcon, CogIcon } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { goto } from '$app/navigation';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';
</script>
<svelte:head>
	<title>TWH | This Webhook Manager</title>
</svelte:head>
<PageTransition />
<DashboardContainer class="relative bg-black bg-gradient-to-br from-indigo-950/0 to-indigo-800/60">
	<img
		alt="bg"
		src="/bg-3.jpg"
		class="absolute h-full w-full object-cover object-top brightness-105"
	/>
	<ScrollArea class="h-full w-full">
		<div class="sticky top-0 inline-flex w-full border-b p-2 backdrop-blur-md">
			<Button size="sm" variant="ghost" onclick={() => goto('/')}>
				<img alt="flat logo" src="/logo-flat.png" class="w-6" />
				THM v.2</Button
			>
			<a href="https://github.com/Boszsp/discord-wh-manager-v2" class="my-auto mr-2 ml-auto size-4">
				<img alt="github" src="/logo/github.png" />
			</a>
		</div>
		<div class="flex h-fit flex-col items-center-safe justify-center-safe">
			<div class="h-48"></div>
			<img alt="flat logo" src="/logo-flat.png" class="mb-12 w-32" />
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
				Welcome to THM v2.x
			</h1>
			<p class="text-xl text-foreground/80">Improve UI and system from v.1</p>
			<div class="h-48"></div>
		</div>
		<div class="flex flex-col gap-4 bg-gradient-to-b from-black/0 to-black/80 to-20% p-8">
			<h3 class="scroll-m-20 text-center text-2xl font-semibold tracking-tight">Feature</h3>
			<div class="inline-flex w-full gap-6">
				<Card class="flex-1 border-none bg-secondary">
					<CardHeader>
						<div class="size-fit rounded-md border p-2">
							<ServerIcon class="size-8" />
						</div>
						<CardTitle>Manage Server Datas</CardTitle>
						<CardDescription>
							A specialized metadata management system focused on tracking and maintaining
							server-related metadata, enabling precise CRUD operations for server information such
							as configuration details, resource allocations, network settings, hardware
							specifications, and operational status. The system provides a centralized repository
							for storing, updating, and retrieving comprehensive server metadata, supporting
							efficient tracking, version control, and comprehensive insights into server
							infrastructure.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card class="flex-1 border-none bg-secondary">
					<CardHeader>
						<div class="size-fit rounded-md border p-2">
							<LayoutTemplateIcon class="size-8" />
						</div>
						<CardTitle>Manage Templates</CardTitle>
						<CardDescription>
							A flexible template management system that allows creating dynamic content templates
							with placeholders, enabling users to define reusable message structures where
							variables can be dynamically replaced. The system supports creating, editing, and
							storing webhook content templates with easy-to-use variable substitution, allowing
							seamless customization of messages by mapping specific values to predefined
							placeholders like `{'{name}'}`, `{'{email}'}`, or `{'{custom_field}'}` for consistent
							and personalized communication across different platforms and integrations.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card class="flex-1 border-none bg-secondary">
					<CardHeader>
						<div class="size-fit rounded-md border p-2">
							<CogIcon class="size-8" />
						</div>
						<CardTitle>Setting</CardTitle>
						<CardDescription>
							A specialized metadata management system focused on tracking and maintaining
							server-related metadata, enabling precise CRUD operations for server information such
							as configuration details, resource allocations, network settings, hardware
							specifications, and operational status. The system provides a centralized repository
							for storing, updating, and retrieving comprehensive server metadata, supporting
							efficient tracking, version control, and comprehensive insights into server
							infrastructure.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</div>
	</ScrollArea>
</DashboardContainer>
