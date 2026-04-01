<script lang="ts">
	import CountBox from '$lib/components/CountBox.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();

	interface AvailableStatus {
		[key: string]: {
			color: string;
			bg: string;
			text: string;
			icon: string;
		};
	}

	const { regs, stats, curr, student, alreadyApplied } = data;

	let availableStatus: AvailableStatus = {
		APPROVED: {
			bg: 'bg-emerald-600',
			color: 'bg-emerald-200',
			text: 'เสร็จสมบูรณ์',
			icon: 'award'
		},
		REJECTED: {
			bg: 'bg-red-600',
			color: 'bg-red-200',
			text: 'ไม่ผ่านการพิจารณา',
			icon: 'X'
		},
		SUBMITTED: {
			bg: 'bg-orange-400',
			color: 'bg-orange-200',
			text: 'กำลังดำเนินการ',
			icon: 'clock'
		}
	};

	function checkApprovedStatus(
		status: string,
		level: number,
		isClosed: boolean
	): 'APPROVED' | 'SUBMITTED' | 'REJECTED' {
		if (status === 'REJECTED') return 'REJECTED';

		// Logic: Must be status APPROVED, reached final level (5), AND the event must be closed
		if (status === 'APPROVED' && level === 5 && isClosed) {
			return 'APPROVED';
		}

		// Otherwise, it is still "กำลังดำเนินการ" (SUBMITTED/PENDING)
		return 'SUBMITTED';
	}

	function applyAward() {
		if (alreadyApplied) {
			alert('คุณได้สมัครรางวัลในรอบนี้แล้ว ไม่สามารถสมัครซ้ำได้');
			return;
		}

		window.location.href = '/award-application/step1';
	}
</script>

<div class="h-screen bg-[#f3f4f6]">
	<div class="flex flex-col items-center justify-center gap-7 p-8">
		<div class="flex w-2/3 flex-col gap-2">
			<div class="flex justify-between">
				<p class="text-3xl font-bold">สวัสดี, {student?.firstName} {student?.lastName}</p>
				{#if curr && new Date(curr.end_date) > new Date() && new Date(curr.start_date) < new Date()}
					<div on:click={applyAward} class="cursor-pointer">
						<div
							class="text-md flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#226e64] p-2 px-5 text-white"
						>
							<Icon name="plus" currentColor="white" size={24} /> สมัครนิสิตดีเด่น
						</div>
					</div>
				{:else}
					<div
						class="text-md flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-gray-500 p-2 px-5 text-white"
					>
						<Icon name="plus" currentColor="white" size={24} /> สมัครนิสิตดีเด่น
					</div>
				{/if}
			</div>
			<p class="text-sm text-gray-600">
				รหัสนิสิต: {student?.student_id} | คณะ{student?.faculty?.name} | ภาควิชา{student?.department
					?.name}
			</p>
		</div>

		<div class="flex w-2/3 flex-wrap justify-evenly gap-8">
			<CountBox
				title="การสมัครทั้งหมด"
				amount={stats?.all}
				iconPrimary="#059669"
				iconSecondary="#ecfdf5"
				icon="book"
			/>
			<CountBox
				title="กำลังดำเนินการ"
				amount={stats?.pending}
				iconPrimary="#f97316"
				iconSecondary="#fff7ed"
				icon="eye"
			/>
			<CountBox
				title="เสร็จสมบูรณ์"
				amount={stats?.approved}
				textColor="#226e64"
				iconPrimary="#22c55e"
				iconSecondary="#f0fdf4"
				icon="trophy"
			/>
			<CountBox
				title="ไม่ผ่านการพิจารณา"
				amount={stats?.rejected}
				textColor="red"
				iconPrimary="#ef4444"
				iconSecondary="#fef2f2"
				icon="trash-2"
			/>
		</div>

		{#if curr}
			<div class="w-2/3">
				<div
					class="flex items-center justify-between rounded-2xl bg-[#2d6a4f] p-6 text-white shadow-md"
				>
					<div class="flex items-center gap-5">
						<div class="rounded-xl bg-white/20 p-4">
							<Icon name="calendar" size={35} currentColor="white" />
						</div>
						<div>
							<h3 class="text-xl font-bold">รอบรับสมัครปัจจุบัน</h3>
							<p class="opacity-90">
								ภาคเรียน {curr?.semester ?? 'ภาคเรียนปัจจุบัน'}/{curr?.academic_year ?? 'xxx'}
							</p>
						</div>
					</div>
					<div class="text-right">
						{#if new Date(curr.end_date) > new Date() && new Date(curr.start_date) < new Date()}
							<span class="rounded-full bg-[#f39c12] px-4 py-1 text-sm font-bold text-white"
								>เปิดรับสมัคร</span
							>
							<p class="mt-2 text-sm font-light">
								หมดเขต: {curr?.end_date ? formatThaiDate(curr.end_date) : '-'}
							</p>
						{:else if new Date(curr.end_date) < new Date()}
							<span class="rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white"
								>ปิดรับสมัคร</span
							>
							<p class="mt-2 text-sm font-light">
								หมดเขตเมื่อ: {curr?.end_date ? formatThaiDate(curr.end_date) : '-'}
							</p>
						{:else if new Date(curr.start_date) > new Date()}
							<span class="rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white"
								>ปิดรับสมัคร</span
							>
							<p class="mt-2 text-sm font-light">
								เปิดรับสมัคร: {curr?.end_date ? formatThaiDate(curr.start_date) : '-'}
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<div class="w-2/3">
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<Icon name="home" size={28} currentColor="green" />
					<h2 class="text-xl font-bold text-gray-800">ประวัติการสมัคร</h2>
				</div>
				<p class="-mt-2 text-sm text-gray-500">รายการสมัครนิสิตดีเด่นทั้งหมดของคุณ</p>

				<div class="custom-scrollbar mt-4 flex flex-col gap-y-2 overflow-y-auto pr-2">
					{#if !regs || regs.length === 0}
						<div
							class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center"
						>
							<p class="text-gray-500">คุณยังไม่มีประวัติการสมัครในขณะนี้</p>
						</div>
					{:else}
						{#each regs as reg}
							{@const currentStatus = checkApprovedStatus(
								reg.status,
								reg.level,
								reg.event.status === 'CLOSED'
							)}

							<a href="/application-list/{reg.id}">
								<div
									class="group mx-2 mb-2 flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition transition-shadow duration-300 hover:shadow-lg hover:shadow-md hover:shadow-emerald-500/50"
								>
									<div class="flex items-center gap-5">
										<div class="{availableStatus[currentStatus]?.color} rounded-xl p-4">
											<Icon
												name={availableStatus[currentStatus]?.icon}
												currentColor="white"
												size={28}
											/>
										</div>
										<div>
											<h4 class="text-lg font-bold text-gray-800">
												รางวัลนิสิตดีเด่น
												<span class="text-sm font-normal text-gray-500">({reg.award.name})</span>
											</h4>
											<p class="text-sm text-gray-400">
												{reg.event.semester}/{reg.event.academic_year} • สมัครเมื่อ {reg.created_at
													? formatThaiDate(reg.created_at)
													: 'XXXX'}
											</p>
										</div>
									</div>

									<div class="flex items-center gap-4">
										<span
											class="{availableStatus[currentStatus]
												?.bg} flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm text-white"
										>
											<Icon
												name={availableStatus[currentStatus]?.icon}
												currentColor="white"
												size={14}
											/>
											{availableStatus[currentStatus]?.text}
										</span>
										<Icon name="arrow-right" class="text-gray-800" />
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>

				<div class="mt-4 mb-2"></div>
			</div>
		</div>
	</div>
</div>
