<script lang="ts">
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	const mockImage = new File([new Blob()], 'mock-image.png', { type: 'image/png' });
	const mockImage2 = new File([new Blob()], 'mock-image-2.png', { type: 'image/png' });
	const mockImage3 = new File([new Blob()], 'mock-image-3.png', { type: 'image/png' });
	const mockImage4 = new File([new Blob()], 'mock-image-4.png', { type: 'image/png' });
	const mockImage5 = new File([new Blob()], 'mock-image-5.png', { type: 'image/png' });
	const mockPdf = new File([new Blob()], 'mock-document.pdf', { type: 'application/pdf' });
</script>

<PageTransition />
<DashboardContainer>
	<ScrollArea class="h-full w-full p-4">
		<Preview
			content={{
				username: '',
				avatar_url: '',
				content: '',
				embeds: [
					{
						avatar_url: '',
						color: 111,
						author: {
							name: 'xxxxxxx',
							url: 'xxx',
							icon_url:
								'https://tranglyslivermerketimesmuncrefam-host5605945-967463913af533c99f.gitlab.io/_ipx/f_webp/discord1.png'
						},
						title: 'pppp',
						description: 'opppp',
						image: {
							url: 'https://tranglyslivermerketimesmuncrefam-host5605945-967463913af533c99f.gitlab.io/_ipx/f_webp/discord1.png'
						},
						fields: [
							{
								name: 'xxxx',
								value: 'xxxxx',
								inline: true
							},
							{
								name: 'xxxx',
								value: 'xxxxx',
								inline: true
							},
							{
								name: 'xxxx',
								value: 'xxxxx',
								inline: true
							},
							{
								name: 'xxx',
								value: 'xxxxx',
								inline: false
							},
							{
								name: '33',
								value: '333',
								inline: true
							},
							{
								name: '333',
								value: '3333',
								inline: true
							}
						],
						footer: {
							text: 'xxxxx',
							icon_url:
								'https://tranglyslivermerketimesmuncrefam-host5605945-967463913af533c99f.gitlab.io/_ipx/f_webp/discord1.png'
						},
						thumbnail: {
							url: 'https://tranglyslivermerketimesmuncrefam-host5605945-967463913af533c99f.gitlab.io/_ipx/f_webp/discord1.png'
						},
						url: ''
					}
				],
				thread_name: '',
				files: [mockImage, mockPdf, mockImage2, mockImage3, mockImage4, mockImage5]
			}}
		/>
	</ScrollArea>
</DashboardContainer>
