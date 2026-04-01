<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ApprovalStats from '$lib/components/ApprovalStats.svelte';
	import RequestTable from '$lib/components/application/RequestTable.svelte';
	import ApplicationHeader from '$lib/components/application/ApplicationHeader.svelte';
	import type { Application } from '$lib/type';
	import type { ActionData, PageData } from './$types';
	import { ApprovalRole, UserRole } from '$lib/enums';
	import ApplicationStat from './components/ApplicationStat.svelte';
	import { apiClient } from '$lib/api';
	import { updateLanguageServiceSourceFile } from 'typescript';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { downloadTableAsPDF } from '$lib/utils/pdf';

	const statusOptions = {
		pending: 'PENDING',
		approved: 'APPROVED',
		rejected: 'REJECTED'
	};

	interface UserCSV {
		name: string;
		studentId: string;
		faculty: string;
		department: string;
		year: string;
		awardType: string;
	}

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const applications = $derived.by(() => {
		return data.applications;
	});
	const stats = $derived(data.stats);

	let isUploading = $state(false);
	const hasParams = $derived(page.url.searchParams.size > 0);

	const info = $derived.by(() => {
		let currentLevel: number = 0;
		switch (data.user.role) {
			case UserRole.DEPT_HEAD:
				currentLevel = 1;
				break;
			case UserRole.ASSO_DEAN:
				currentLevel = 2;
				break;
			case UserRole.DEAN:
				currentLevel = 3;
				break;
			case UserRole.NISIT_DEV:
				currentLevel = 4;
				break;
			case UserRole.BOARD:
				currentLevel = 5;
				break;
		}
		return { currentLevel };
	});

	let isDownloading = $state(false);

	let isLoading = $state(false);

	let contentRef: HTMLDivElement; // ← เพิ่ม

	async function handleDownload() {
		isLoading = true;

		const headers = [
			'ลำดับ',
			'รหัสนิสิต',
			'ชื่อ-นามสกุล',
			'คณะ',
			'ภาควิชา',
			'ชั้นปี',
			'ประเภทรางวัล'
		];

		const response = await fetch('/api/export-csv');

		if (!response.ok) {
			throw new Error('ไม่สามารถดึงข้อมูลได้');
		}

		const allApplications: Application[] = await response.json();


		await downloadTableAsPDF(allApplications, headers, 'student_report.pdf', data.user.name);

		isLoading = false;
	}

	const handleDownloadClick = async () => {
		if (isDownloading) return;

		try {
			isDownloading = true;

			const response = await fetch('/api/export-csv');

			if (!response.ok) {
				throw new Error('ไม่สามารถดึงข้อมูลได้');
			}

			const allApplications = await response.json();
			exportToCSV(allApplications);
		} catch (error) {
			console.error('Download error:', error);
			alert('เกิดข้อผิดพลาดในการดาวน์โหลด');
		} finally {
			isDownloading = false;
		}
	};

	const exportToCSV = (data: Application[]) => {
		const headers = ['ลำดับ', 'รหัสนิสิต', 'ชื่อ-นามสกุล', 'คณะ', 'ภาควิชา', 'ประเภทรางวัล'];

		const rows = data.map((app) => [
			app.user.student_id,
			`${app.user.firstName} ${app.user.lastName}`,
			app.user.faculty.name,
			app.user.department.name,
			String(app.year),
			app.award.name
		]);

		const csvContent = [headers, ...rows]
			.map((row) => row.map((cell) => `"${cell}"`).join(','))
			.join('\n');

		const BOM = '\uFEFF';
		const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', 'student_list_outstanding.csv');
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
</script>

<div class="flex flex-col gap-7 p-10">
	<ApplicationHeader
		role={data.user.role}
		desc={'ลงนามประกาศนิสิตดีเด่นทั้งหมดที่ได้รับการอนุมัติครบทุกขั้นตอนแล้ว'}
	/>

	{#if data.stats.totalInprogress !== 0 && !hasParams}
		<div class="flex flex-col gap-10">
			<div class="flex items-center gap-5 rounded-2xl bg-gray-100 p-8">
				<div class="rounded-2xl bg-gray-200 p-5">
					<Icon name="calendarOff" class="stroke-gray-600" size={30} />
				</div>
				<div class="flex flex-col gap-2">
					<p class="text-xl font-bold">ขณะนี้ไม่อยู่ในช่วงพิจารณาลงนามประกาศรางวัล</p>
					<p class="text-sm text-gray-400">
						ระบบจะเปิดให้พิจารณาลงนามประกาศรายชื่อนิสิตดีเด่นเมื่อใบคำร้องทั้งหมดดำเนินการจนสิ้นสุดแล้ว
					</p>
				</div>
			</div>
		</div>
	{/if}

	{#if data.applications.length > 0 || hasParams}
		<div class="flex flex-col gap-7">
			{#if data.applications.length > 0}
				<div
					class="flex flex-col rounded-2xl bg-linear-to-r from-blue-500 to-blue-300 p-10 text-white"
				>
					<div class="flex flex-col items-start justify-start gap-8">
						<div class="flex items-center gap-5">
							<div class="flex items-center justify-center rounded-2xl bg-blue-400 p-3">
								<Icon name="shieldCheck" class="stroke-white"></Icon>
							</div>
							<div class="flex flex-col gap-1">
								<p class="text-xl font-bold">ลงนามประกาศนิสิตดีเด่นประจำภาคเรียน</p>
								<p class="text-sm opacity-80">
									ดาวน์โหลดข้อมูลนิสิตที่ได้รับรางวัลเพื่อเสนอให้อธิการบดีลงนาม
								</p>
							</div>
						</div>

						<div class="flex w-full items-stretch gap-5">
							<button
								onclick={handleDownload}
								disabled={isLoading}
								class="button-effect flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-500 shadow-lg disabled:opacity-50"
							>
								<Icon name="download" size={18} />
								<span class="text-sm">ดาวน์โหลดข้อมูลนิสิตดีเด่น</span>
							</button>

							<form
								method="POST"
								action="?/upload"
								enctype="multipart/form-data"
								class="flex flex-1 items-center gap-4"
								use:enhance={() => {
									isUploading = true;
									return async ({ update }) => {
										isUploading = false;
										await update();
										if (form?.success) alert('อัปโหลดสำเร็จ');
									};
								}}
							>
								<input type="hidden" name="event-id" value={data.applications[0]?.event_id || ''} />
								<input
									name="document"
									type="file"
									accept=".pdf"
									required
									class="block flex-1 cursor-pointer rounded-xl border border-white/30 p-3 text-xs text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1 file:text-blue-500"
								/>
								<button
									type="submit"
									class="button-effect rounded-xl bg-white px-5 py-2 text-sm font-semibold text-blue-500"
									>อัปโหลด</button
								>
							</form>
						</div>
					</div>
				</div>
			{/if}

			<!-- <ApplicationStat stats={data.stats} /> -->

			<!-- <RequestTable
				needFilter={true}
				user={data.user}
				applications={data.applications}
				currentLevel={info.currentLevel}
				{statusOptions}
				searchQuery={data.search || ''}
				statusFilter={data.status || ''}
				currentPage={data.currentPage || 1}
				totalPages={data.totalPages || 1}
			/> -->
		</div>
	{:else}
		<div class="flex flex-col items-center gap-8 rounded-xl bg-white p-15 shadow-md">
			<div class="flex items-center justify-center rounded-2xl bg-gray-100 p-5">
				<Icon name="clock" class="stroke-gray-400" size={40} />
			</div>
			<div class="flex max-w-100 flex-col gap-2 text-center">
				<p class="text-lg font-semibold">ยังไม่มีรายชื่อนิสิตที่รอพิจารณา</p>
				<p class="text-sm text-gray-400">
					รายชื่อจะแสดงที่นี่เมื่อผ่านการอนุมัติจากประธานคณะกรรมการแล้ว
				</p>
			</div>
		</div>
	{/if}
</div>
