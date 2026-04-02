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
	const isClosed = $derived(application!.event.status === 'CLOSED');

	const { currentLevel, previousLevel } = $derived.by(() => {
		let currentLevel = RoleLevel['ASSO_DEAN'];
		switch (data.user.role) {
			case UserRole.DEPT_HEAD:
				currentLevel = RoleLevel['DEPT_HEAD'];
				break;
			case UserRole.ASSO_DEAN:
				currentLevel = RoleLevel['ASSO_DEAN'];
				break;
			case UserRole.DEAN:
				currentLevel = RoleLevel['DEAN'];
				break;
			case UserRole.BOARD:
				currentLevel = RoleLevel['BOARD'];
				break;
			case UserRole.NISIT:
				currentLevel = RoleLevel['NISIT'];
				break;
		}
		const previousLevel = currentLevel - 1 < 0 ? currentLevel : currentLevel - 1;
		return { currentLevel, previousLevel };
	});

	const status: string = $derived.by(() => {
		if (application === undefined) return '';
		const parts: string[] = application.status.split('_', 1);
		return parts[0];
	});

	const role: UserRole = $derived(data.user.role);

	let showDeleteDialog = $state(false);

	function handleDelete() {
		showDeleteDialog = true;
	}

	function cancelDelete() {
		showDeleteDialog = false;
	}
</script>

{#if application === undefined || approvals === undefined}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
		<p class="text-2xl">ไม่พบข้อมูลใบสมัครนี้</p>
		<a href="/my-awards">
			<div class="button-effect mb-10 flex gap-2 rounded-xl border p-3">
				<Icon name="arrow-left" />
				<p>กลับหน้าก่อนหน้า</p>
			</div>
		</a>
	</div>
{:else if !data.isOwnApplication && data.user.role === UserRole.NISIT}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
		<p class="text-2xl">คุณไม่มีสิทธิเข้าถึงใบสมัครนี้</p>
		<a href="/my-awards">
			<div class="button-effect mb-10 flex gap-2 rounded-xl border p-3">
				<Icon name="arrow-left" />
				<p>กลับหน้าก่อนหน้า</p>
			</div>
		</a>
	</div>
{:else}
	<div class="bg-background p-10">
		<a href="/my-awards">
			<div class="button-effect mb-10 flex gap-2">
				<Icon name="arrow-left" />
				<p>กลับหน้าก่อนหน้า</p>
			</div>
		</a>
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-start gap-3">
				<p class="text-2xl font-bold">{application?.id}</p>
				{#if role === UserRole.NISIT}
					{#if application.level === RoleLevel.BOARD && isClosed}
						<div
							class="w-fit rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm text-emerald-400"
						>
							เสร็จสมบูรณ์
						</div>
					{:else if application.status === ApprovalStatus.REJECTED}
						<div class=" rounded-full border border-red-400 bg-red-100 px-3 py-1 text-red-400">
							ไม่ผ่านการพิจารณา
						</div>
					{:else}
						<div
							class=" rounded-full border border-orange-400 bg-orange-100 px-3 py-1 text-orange-400"
						>
							กำลังดำเนินการ
						</div>
					{/if}
				{:else if (application.level === currentLevel && application.status === ApprovalStatus.APPROVED) || application.level > currentLevel}
					<div
						class="w-fit rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm text-emerald-400"
					>
						อนุมัติ
					</div>
				{:else if application.level === currentLevel && application.status === ApprovalStatus.REJECTED}
					<div class=" rounded-full border border-red-400 bg-red-100 px-3 py-1 text-red-400">
						ปฏิเสธ
					</div>
				{:else}
					<div class=" rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-amber-400">
						รอพิจารณา
					</div>
				{/if}
			</div>
			{#if data.isOwnApplication && data.isEditable}
				<div class="flex gap-2">
					<a href="/application-list/{data.application?.id}/edit">
						<div
							class="text-md flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-transparent bg-[#226e64] p-2 px-5 text-white transition-all hover:border-[#226e64] hover:bg-white hover:text-[#226e64]"
						>
							แก้ไขใบสมัคร
						</div>
					</a>
					<button
						onclick={handleDelete}
						class="text-md flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-transparent bg-red-500 p-2 px-5 text-white transition-all hover:border-red-500 hover:bg-white hover:text-red-500"
					>
						ลบใบสมัคร
					</button>
				</div>
			{/if}
			<p class=" text-gray-400">ยื่นเมื่อ {formatThaiDate(application?.created_at)}</p>
		</div>
		<div class=" mt-7 flex flex-col gap-6 lg:flex-row">
			<div class="flex flex-2 flex-col gap-6">
				<NisitInfo {application} />
				<ApplicationComponent {application} />
				{#if application?.documents && Object.keys(application.documents).length > 0}
					<DocumentSection {application} />
				{/if}
			</div>
			<div class={`flex flex-1 flex-col gap-6`}>
				<Progression {approvals} {isClosed} />
				{#if application.level === previousLevel && role !== UserRole.NISIT}
					<ApproveSection {form} />
				{/if}
			</div>
		</div>

		{#if showDeleteDialog}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<form method="POST" action="?/delete">
					<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
						<div class="mb-4">
							<h2 class="text-xl font-semibold text-gray-900">ยืนยันการลบ</h2>
						</div>
						<p class="mb-6 text-gray-600">
							คุณแน่ใจหรือไม่ที่จะลบใบสมัครนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
						</p>
						{#if form?.success === false && form?.message}
							<div class="mb-4 rounded-xl border border-red-400 bg-red-50 p-3 text-red-600">
								{form.message}
							</div>
						{/if}
						<div class="flex justify-end gap-3">
							<button
								type="button"
								onclick={cancelDelete}
								class="rounded-2xl border border-gray-300 px-5 py-2 text-gray-700 transition-colors hover:bg-gray-50"
							>
								ยกเลิก
							</button>
							<button
								type="submit"
								class="rounded-2xl bg-red-500 px-5 py-2 text-white transition-colors hover:bg-red-600"
							>
								ลบ
							</button>
						</div>
					</div>
				</form>
			</div>
		{/if}
	</div>
{/if}
