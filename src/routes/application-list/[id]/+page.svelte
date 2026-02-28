<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ApproveSection from './components/ApproveSection.svelte';
	import CommentSection from './components/CommentSection.svelte';
	import NisitInfo from './components/NisitInfo.svelte';
	import Progression from './components/Progression.svelte';
	import ApplicationComponent from './components/Application.svelte';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import { ApprovalStatus, RoleLevel, UserRole } from '$lib/enums.js';
	import DocumentSection from './components/DocumentSection.svelte';
	import type { ActionData, PageData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	const application = $derived(data.application);
	const approvals = $derived(data.approvals);

	// TODO: Use user from cookies instead

	const { currentLevel, previousLevel } = $derived.by(() => {
		let currentLevel = RoleLevel['ASSO_DEAN'];
		switch (data.user?.role) {
			case UserRole.DEPT_HEAD:
				currentLevel = RoleLevel['DEPT_HEAD'];
			case UserRole.ASSO_DEAN:
				currentLevel = RoleLevel['ASSO_DEAN'];
			case UserRole.DEAN:
				currentLevel = RoleLevel['DEAN'];
			case UserRole.BOARD:
				currentLevel = RoleLevel['BOARD'];
			case UserRole.BOARD_HEAD:
				currentLevel = RoleLevel['BOARD_HEAD'];
			case UserRole.NISIT:
				currentLevel = RoleLevel['NISIT'];
		}
		const previousLevel = currentLevel - 1 < 0 ? currentLevel : currentLevel - 1;
		return { currentLevel, previousLevel };
	});

	console.log(currentLevel, previousLevel);

	const status: string = $derived.by(() => {
		if (application === undefined) return '';
		const parts: string[] = application.status.split('_', 1);
		return parts[0];
	});

	const role: UserRole = $derived(data.user.role);
</script>

{#if application === undefined || approvals === undefined}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
		<p class="text-2xl">ไม่พบข้อมูลใบสมัครนี้</p>
		<button
			type="button"
			class="button-effect mb-10 flex gap-2 rounded-xl border p-3"
			onclick={() => history.back()}
		>
			<Icon name="arrow-left" />
			<p>กลับหน้าก่อนหน้า</p>
		</button>
	</div>
{:else}
	<div class="bg-background p-10">
		<button type="button" class="button-effect mb-10 flex gap-2" onclick={() => history.back()}>
			<Icon name="arrow-left" />
			<p>กลับหน้าก่อนหน้า</p>
		</button>
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-start gap-3">
				<p class="text-2xl font-bold">{application?.id}</p>
				{#if role !== UserRole.NISIT}
					{#if application.status === ApprovalStatus.APPROVED && application.level === previousLevel}
						<div
							class=" rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-amber-400"
						>
							รอพิจารณา
						</div>
					{:else if application.status === ApprovalStatus.REJECTED && application.level === currentLevel}
						<div class=" rounded-full border border-red-400 bg-red-100 px-3 py-1 text-red-400">
							ปฏิเสธ
						</div>
					{:else}
						<div
							class="w-fit rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm text-emerald-400"
						>
							อนุมัติ
						</div>
					{/if}
				{:else if application.status !== ApprovalStatus.REJECTED && application.level !== RoleLevel.BOARD_HEAD}
					<div class=" rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-amber-400">
						รอพิจารณา
					</div>
				{:else if application.status === ApprovalStatus.REJECTED}
					<div class=" rounded-full border border-red-400 bg-red-100 px-3 py-1 text-red-400">
						ปฏิเสธ
					</div>
				{:else}
					<div
						class="w-fit rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm text-emerald-400"
					>
						อนุมัติ
					</div>
				{/if}
			</div>
			<p class=" text-gray-400">ยื่นเมื่อ {formatThaiDate(application?.created_at)}</p>
		</div>
		<div class=" mt-7 flex gap-6">
			<div class="flex flex-2 flex-col gap-6">
				<NisitInfo {application} />
				<ApplicationComponent {application} />
				<DocumentSection {application} />
			</div>
			<div class={`flex flex-1 flex-col gap-6`}>
				<Progression {approvals} />
				{#if application.level === previousLevel && role !== UserRole.NISIT}
					<ApproveSection {form} {role} />
				{/if}
			</div>
		</div>
	</div>
{/if}
