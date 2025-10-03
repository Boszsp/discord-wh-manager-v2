<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboardContainer.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardDescription,
		CardHeader,
		CardTitle,
		CardFooter
	} from '$lib/components/ui/card';
	import { LayoutTemplateIcon, ServerIcon, CogIcon, ChevronRightIcon } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
</script>

<DashboardContainer class="bg-background">
	<ScrollArea class="h-full w-full">
		<div class="flex flex-col gap-4 p-8">
			<h3 class="scroll-m-20 text-2xl font-semibold text-center tracking-tight">Feature</h3>
			<Card>
				<CardHeader>
					<div class="size-fit rounded-md border p-2">
						<ServerIcon class="size-8" />
					</div>
					<CardTitle>Manage Server Datas</CardTitle>
					<CardDescription>
						A specialized metadata management system focused on tracking and maintaining
						server-related metadata, enabling precise CRUD operations for server information such as
						configuration details, resource allocations, network settings, hardware specifications,
						and operational status. The system provides a centralized repository for storing,
						updating, and retrieving comprehensive server metadata, supporting efficient tracking,
						version control, and comprehensive insights into server infrastructure.
					</CardDescription>
				</CardHeader>
				<CardFooter class="justify-end">
					<Button>Goto Server Setting <ChevronRightIcon /></Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<div class="size-fit rounded-md border p-2">
						<LayoutTemplateIcon class="size-8" />
					</div>
					<CardTitle>Manage Templates</CardTitle>
					<CardDescription>
						A flexible template management system that allows creating dynamic content templates
						with placeholders, enabling users to define reusable message structures where variables
						can be dynamically replaced. The system supports creating, editing, and storing webhook
						content templates with easy-to-use variable substitution, allowing seamless
						customization of messages by mapping specific values to predefined placeholders like `{'{name}'}`,
						`{'{email}'}`, or `{'{custom_field}'}` for consistent and personalized communication
						across different platforms and integrations.
					</CardDescription>
				</CardHeader>
				<CardFooter class="justify-end">
					<Button>Goto Templates Setting <ChevronRightIcon /></Button>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<div class="size-fit rounded-md border p-2">
						<CogIcon class="size-8" />
					</div>
					<CardTitle>Setting</CardTitle>
					<CardDescription>
						A specialized metadata management system focused on tracking and maintaining
						server-related metadata, enabling precise CRUD operations for server information such as
						configuration details, resource allocations, network settings, hardware specifications,
						and operational status. The system provides a centralized repository for storing,
						updating, and retrieving comprehensive server metadata, supporting efficient tracking,
						version control, and comprehensive insights into server infrastructure.
					</CardDescription>
				</CardHeader>
				<CardFooter class="justify-end">
					<Button>Goto Server Setting <ChevronRightIcon /></Button>
				</CardFooter>
			</Card>
		</div>
	</ScrollArea>
</DashboardContainer>
