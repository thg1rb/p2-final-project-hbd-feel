<script lang="ts">
	import { apiClient } from '$lib/api';
	import Icon from '$lib/components/Icon.svelte';
	import { onMount } from 'svelte';

	let { filePath } = $props();
	let previewUrl: string | null = $state(null);
	let loading = $state(true);

	onMount(() => {
		const loadFile = async () => {
			try {
				const fileResponse = await apiClient.get(`/minio/download`, {
					params: { path: filePath },
					responseType: 'blob'
				});
				previewUrl = URL.createObjectURL(fileResponse.data);
			} catch (e) {
				console.error('Failed to load PDF', e);
			}
		};

		console.log('TEST');

		loadFile();

		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	});
</script>

<div class="flex flex-1 flex-col gap-4 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="trophy" class="stroke-primary" />
		<p>แบบเสนอรายชื่อนิสิตดีเด่น</p>
	</div>

	<div class="mt-5 flex h-full flex-col gap-5 text-sm min-h-200">
		{#if previewUrl}
			<iframe
				src={previewUrl}
				title="PDF Preview"
				class="h-full w-full rounded-lg border border-gray-100"
				frameborder="0"
			></iframe>
		{:else}
			<div class="flex h-75 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
				กำลังประมวลผลไฟล์ PDF...
			</div>
		{/if}
	</div>
</div>
