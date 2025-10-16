<script lang="ts">
	import { createZip, unzipFiles } from '$lib/utilsFn/zip';
	import { createPdf, extractPdfText, splitPdf } from '$lib/utilsFn/pdf';
	import { changeImageExtension, dataUrlToBlob } from '$lib/utilsFn/image';

	let filesToZip: File[] = [];
	let zipFile: File | null = null;
	let unzippedFiles: File[] = [];

	let pdfFile: File | null = null;
	let pdfText = '';
	let splitPdfs: Blob[] = [];

	const handleCreateZip = async () => {
		if (filesToZip.length === 0) {
			alert('Please select files to zip');
			return;
		}
		zipFile = await createZip(filesToZip);
	};

	const handleUnzip = async () => {
		if (!zipFile) {
			alert('Please create a zip file first');
			return;
		}
		unzippedFiles = await unzipFiles(zipFile);
	};

	const handleCreatePdf = async () => {
		const pdfData = await createPdf();
		pdfFile = new File([n], 'test.pdf', { type: 'application/pdf' });
	};

	const handleExtractText = async () => {
		if (!pdfFile) {
			alert('Please create a pdf file first');
			return;
		}
		const reader = new FileReader();
		reader.onload = async () => {
			const pdfData = new Uint8Array(reader.result as ArrayBuffer);
			pdfText = await extractPdfText(pdfData);
		};
		reader.readAsArrayBuffer(pdfFile);
	};

	const handleSplitPdf = async () => {
		if (!pdfFile) {
			alert('Please create a pdf file first');
			return;
		}
		const reader = new FileReader();
		reader.onload = async () => {
			const pdfData = new Uint8Array(reader.result as ArrayBuffer);
			const splitPdfData = await splitPdf(pdfData);
			splitPdfs = splitPdfData.map(
				(data, i) => new Blob([data], { type: 'application/pdf' })
			);
		};
		reader.readAsArrayBuffer(pdfFile);
	};

	const handleFileSelect = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			filesToZip = Array.from(target.files);
		}
	};
</script>

<h1>Utils Test Page</h1>

<h2>ZIP</h2>
<input type="file" multiple onchange={handleFileSelect} />
<button onclick={handleCreateZip}>Create Zip</button>
{#if zipFile}
	<p>Zip created: {zipFile.name}</p>
	<button onclick={handleUnzip}>Unzip</button>
{/if}
{#if unzippedFiles.length > 0}
	<p>Unzipped files:</p>
	<ul>
		{#each unzippedFiles as file}
			<li>{file.name}</li>
		{/each}
	</ul>
{/if}

<h2>PDF</h2>
<button onclick={handleCreatePdf}>Create PDF</button>
{#if pdfFile}
	<p>PDF created: {pdfFile.name}</p>
	<button onclick={handleExtractText}>Extract Text</button>
	<button onclick={handleSplitPdf}>Split PDF</button>
{/if}
{#if pdfText}
	<p>Extracted text:</p>
	<pre>{pdfText}</pre>
{/if}
{#if splitPdfs.length > 0}
	<p>Split PDFs:</p>
	<ul>
		{#each splitPdfs as pdf, i}
			<li><a href={URL.createObjectURL(pdf)} download={`split-${i}.pdf`}>Split {i}</a></li>
		{/each}
	</ul>
{/if}

<h2>Image</h2>
<p>Original: test.png, New: {changeImageExtension('test.png', 'jpg')}</p>
