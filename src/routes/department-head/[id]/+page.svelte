<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ApproveSection from './components/ApproveSection.svelte';
	import CommentSection from './components/CommentSection.svelte';
	import NisitInfo from './components/NisitInfo.svelte';
	import Progression from './components/Progression.svelte';
	import type { PageData } from './$types';
	import type { Application } from '$lib/type';
	import ApplicationComponent from './components/Application.svelte';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	let { data }: { data: PageData } = $props();

	const application: Application = data.application;

	const file = data.filePath;
</script>

<div class="bg-background p-10">
	<button type="button" class="button-effect mb-10 flex gap-2" onclick={() => history.back()}>
		<Icon name="arrow-left" />
		<p>กลับหน้าก่อนหน้า</p>
	</button>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-start gap-3">
			<p class="text-2xl font-bold">{application.id}</p>
			<div class=" rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-amber-400">
				รอพิจารณา
			</div>
		</div>
		<p class=" text-gray-400">ยื่นเมื่อ {formatThaiDate(application.created_at)}</p>
	</div>
	<div class=" mt-7 flex gap-6">
		<div class="flex flex-2 flex-col gap-6">
			<NisitInfo {application} />
			<ApplicationComponent filePath={file} />
			<CommentSection />
		</div>
		<div class="flex flex-1 flex-col gap-6">
			<Progression />
			<ApproveSection />
		</div>
	</div>
</div>
