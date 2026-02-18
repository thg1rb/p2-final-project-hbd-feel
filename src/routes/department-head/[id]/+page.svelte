<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ApproveSection from './components/ApproveSection.svelte';
	import CommentSection from './components/CommentSection.svelte';
	import NisitInfo from './components/NisitInfo.svelte';
	import Progression from './components/Progression.svelte';
	import ApplicationComponent from './components/Application.svelte';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import { ApplicationStatus } from '$lib/enums.js';
	let { data, form } = $props();

	const application = $derived(data.application);
	const approvals = $derived(data.approvals);
	const filePath = $derived(data.filePath);
	const headDeptApproval = $derived(data.headDeptApproval);

	const status: string = $derived.by(() => {
		const parts: string[] = application.status.split('_', 1);
		return parts[0];
	});

	const role: string = $derived.by(() => {
		const parts: string[] = application.status.split('_');
		return parts.slice(1).join('_');
	});
</script>

<div class="bg-background p-10">
	<button type="button" class="button-effect mb-10 flex gap-2" onclick={() => history.back()}>
		<Icon name="arrow-left" />
		<p>กลับหน้าก่อนหน้า</p>
	</button>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-start gap-3">
			<p class="text-2xl font-bold">{application.id}</p>
			{#if application.status === ApplicationStatus.SUBMITTED}
				<div class=" rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-amber-400">
					รอพิจารณา
				</div>
			{:else if role !== 'DEPT_HEAD'}
				<div class=" rounded-full border border-primary bg-amber-100 px-3 py-1 text-primary">
					อนุมติ
				</div>
			{:else if role === 'DEPT_HEAD' && status === 'APPROVED'}
				<div class=" rounded-full border border-primary bg-primary/10 px-3 py-1 text-primary">
					อนุมติ
				</div>
			{:else if role === 'DEPT_HEAD' && status === 'REJECTED'}
				<div class=" rounded-full border border-red-400 bg-red-100 px-3 py-1 text-red-400">
					ปฏิเสธ
				</div>
			{/if}
		</div>
		<p class=" text-gray-400">ยื่นเมื่อ {formatThaiDate(application.created_at)}</p>
	</div>
	<div class=" mt-7 flex gap-6">
		<div class="flex flex-2 flex-col gap-6">
			<NisitInfo {application} />
			<ApplicationComponent {filePath} />
			{#if application.status !== ApplicationStatus.SUBMITTED}
				<CommentSection {headDeptApproval} />
			{:else}
				<div></div>
			{/if}
		</div>
		<div
			class={`flex flex-1 flex-col ${application.status !== ApplicationStatus.SUBMITTED ? '' : 'gap-6'}`}
		>
			<Progression {approvals} />
			{#if application.status !== ApplicationStatus.SUBMITTED}
				<div></div>
			{:else}
				<ApproveSection {form} />
			{/if}
		</div>
	</div>
</div>
