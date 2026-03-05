<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { Application, User, UserFromToken } from '$lib/type';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import { goto } from '$app/navigation';
	import { UserRole } from '$lib/enums';

	interface Props {
		needFilter?: boolean;
		user: UserFromToken;
		applications: Application[];
		currentLevel: number;
		statusOptions: {
			pending: string;
			approved: string;
			rejected: string;
		};
		searchQuery?: string;
		statusFilter?: string;
		currentPage?: number;
		totalPages?: number;
	}

	let {
		needFilter,
		user,
		applications,
		currentLevel,
		statusOptions,
		searchQuery = '',
		statusFilter = '',
		currentPage = 1,
		totalPages = 1
	}: Props = $props();

	console.log('IN COMPONENT', applications.length);

	function handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const search = formData.get('search') as string;
		const status = formData.get('status') as string;

		const params = new URLSearchParams(); // สร้างใหม่เพื่อความสะอาด

		// ใช้ trim() และเช็คค่าว่างก่อน set
		if (search && search.trim() !== '') {
			params.set('search', search.trim());
		}

		if (status && status.trim() !== '') {
			params.set('status', status.trim());
		}

		// ถ้าไม่มี params เลย ให้ไปที่ path เปล่าๆ
		const queryString = params.toString();
		const newUrl = queryString ? `?${queryString}` : window.location.pathname;

		goto(newUrl, {
			keepFocus: true,
			replaceState: true,
			noScroll: true
		});
	}

	function changePage(newPage: number) {
		if (newPage < 1 || newPage > totalPages) return;

		const params = new URLSearchParams(window.location.search);
		params.set('page', newPage.toString());

		goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true,
			replaceState: true
		});
	}
</script>

<div class="flex w-full flex-col gap-y-6 rounded-xl bg-white p-5 shadow-sm">
	<form onsubmit={handleSubmit} class="flex w-full flex-col gap-2.5 md:flex-row">
		<div class="flex flex-1 flex-row items-stretch gap-x-2.5">
			<input
				name="search"
				value={searchQuery}
				placeholder="ค้นหาจากรหัสใบสมัคร ชื่อจริง หรือรหัสนิสิต"
				class="w-full rounded-2xl border-gray-300 text-sm placeholder:font-light placeholder:text-slate-400 focus:border-primary focus:ring-primary"
			/>
			{#if needFilter === undefined}
				<select
					name="status"
					value={statusFilter}
					class="cursor-pointer rounded-2xl border-slate-300 px-7 text-sm font-semibold focus:border-primary focus:ring-primary"
				>
					<option value="">ทั้งหมด</option>
					<option value={statusOptions.pending}>รอพิจารณา</option>
					<option value={statusOptions.approved}>อนุมัติ</option>
					<option value={statusOptions.rejected}>ปฏิเสธ</option>
				</select>
			{/if}
		</div>
		<button
			type="submit"
			class="button-effect cursor-pointer rounded-2xl bg-primary p-3 font-semibold text-white focus:border-primary focus:ring-primary"
		>
			<Icon name="search" class=" text-white" size={20}></Icon>
		</button>
	</form>
	<div class="overflow-auto rounded-xl border border-gray-300 bg-white">
		<table class="w-full min-w-fit">
			<thead class="divide-y border-b border-gray-200 bg-gray-100">
				<tr class="">
					<th class=" p-4 text-start">ชื่อนิสิต</th>
					<th class=" p-4 text-start">รหัสนิสิต</th>
					<th class=" p-4 text-start">ภาควิชา</th>
					<th class="  p-4 text-start">ประเภทรางวัล</th>
					<th class="  p-4 text-start">สถานะ</th>
					<th class="  p-4 text-start">วันที่ยื่น</th>
					<th class="  p-4 text-start"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-300 text-sm">
				{#each applications as app}
					<tr class="">
						<td class=" p-4 text-sm">{app.user.firstName} {app.user.lastName}</td>
						<td class=" p-4 text-sm">{app.user.student_id}</td>
						<td class=" p-4">{app.user.department.name}</td>
						<td class=" p-4">{app.award.name}</td>
						<td class=" p-4">
							{#if app.level === currentLevel && app.status === 'REJECTED'}
								<div
									class="w-fit truncate rounded-full border border-red-400 bg-red-50 px-3 py-1 text-sm text-red-400"
								>
									ปฏิเสธ
								</div>
							{:else if app.level >= currentLevel}
								<div
									class="w-fit truncate rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm text-emerald-400"
								>
									อนุมัติ
								</div>
							{:else}
								<div
									class="w-fit truncate rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1 text-sm text-yellow-400"
								>
									รอพิจารณา
								</div>
							{/if}
						</td>
						<td class=" p-4">{formatThaiDate(app.created_at)}</td>
						<td class=" p-4">
							<a
								href={`/application-list/${app.id}`}
								class="button-effect flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-300 p-2"
							>
								<Icon name="eye" size={20} class="stroke-gray-500" />
								<p class="text-sm text-gray-500">ดูรายละเอียด</p>
							</a>
						</td>
					</tr>
				{:else}
					<tr class="divide-x">
						<td colspan="7" class="px-6 py-32 text-center text-slate-500"> ไม่พบข้อมูล </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="mt-4 flex w-full flex-row items-center justify-end">
		<div class="flex flex-row items-center gap-x-5">
			<button
				onclick={() => changePage(currentPage - 1)}
				disabled={currentPage === 1}
				class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			>
				<Icon name="arrow-head-left" class={currentPage === 1 ? 'stroke-gray-300' : ''} />
			</button>

			<p class="rounded-xl border border-slate-300 px-5 py-2">
				{currentPage}
			</p>

			<button
				onclick={() => changePage(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			>
				<Icon name="arrow-head-right" class={currentPage === totalPages ? 'stroke-gray-300' : ''} />
			</button>
		</div>
	</div>
</div>
