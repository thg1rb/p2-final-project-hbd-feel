<script lang="ts">
	import { apiClient } from '$lib/api';
	import Icon from '$lib/components/Icon.svelte';
	import type { Application } from '$lib/type';
	import { onMount } from 'svelte';

	interface Props {
		application: Application;
	}
	let { application }: Props = $props();

	let previewUrls: (string | null)[] = $state([]);

	onMount(() => {
		previewUrls = new Array(application.award.requirements.length).fill(null);

		const loadFiles = async () => {
			previewUrls = new Array(application.award.requirements.length).fill(null);

			const tasks = application.award.requirements.map(async (req, i) => {
				try {
					const targetPath: string = application.documents[req.id].file_path;

					const res = await fetch(`/api/get-image?path=${encodeURIComponent(targetPath)}`);

					if (!res.ok) throw new Error('Fetch failed');

					const blob = await res.blob();

					previewUrls[i] = URL.createObjectURL(blob);
				} catch (e) {
					console.error(`Failed to load PDF at index ${i}`, e);
				}
			});

			await Promise.all(tasks);
		};

		loadFiles();

		return () => {
			previewUrls.forEach((url) => {
				if (url) URL.revokeObjectURL(url);
			});
		};
	});
</script>

<div class="flex flex-1 flex-col gap-6 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="book" class="stroke-primary" />
		<p>หลักฐานแนบใบคำร้อง</p>
	</div>

	<div class="flex h-full flex-col gap-10">
		{#each application.award.requirements as requirement, i}
			<div class="flex h-full min-h-100 flex-col gap-3 text-sm">
				<p class="font-medium underline">{i + 1}. {requirement.name}</p>

				{#if previewUrls[i]}
					<iframe
						src={previewUrls[i]}
						title="PDF Preview"
						class="h-125 w-full rounded-lg border border-gray-100"
						frameborder="0"
					></iframe>
				{:else}
					<div class="flex h-50 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
						<span class="animate-pulse">กำลังโหลดไฟล์ลำดับที่ {i + 1}...</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
