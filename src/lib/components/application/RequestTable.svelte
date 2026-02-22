<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { Application } from '$lib/type';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import { goto } from '$app/navigation';

	interface Props {
		applications: Application[];
		currentLevel: number;
		statusOptions: {
			pending: string
		  approved: string
			rejected: string
		}
		searchQuery?: string
		statusFilter?: string
		currentPage?: number
		totalPages?: number
	}

	let { applications, currentLevel, statusOptions, searchQuery = '', statusFilter = '', currentPage = 1, totalPages = 1 }: Props = $props();

	function handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const search = formData.get('search') as string;
		const status = formData.get('status') as string;

		const params = new URLSearchParams();
		if (search && search.trim()) params.set('search', search);
		if (status && status.trim()) params.set('status', status);

		const newUrl = params.toString()
			? `?${params.toString()}`
			: window.location.pathname;

		goto(newUrl, {
		  keepFocus: true,
		  replaceState: true
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

<div class="w-full p-5 flex flex-col gap-y-6 bg-white shadow-sm rounded-xl">
  <form onsubmit={handleSubmit} class="w-full flex flex-col md:flex-row gap-2.5">
      <div class="flex-1 flex flex-row gap-x-2.5">
          <div class="relative flex-2">
              <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></Icon>
              <input name="search" value={searchQuery} placeholder="ค้นหาจากรหัสใบสมัคร ชื่อจริง หรือรหัสนิสิต"
                  class="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md pl-10 placeholder:font-light placeholder:text-slate-400">
          </div>
          <select name="status"
              value={statusFilter}
              class="px-10 py-1.5 border-slate-300 focus:border-primary focus:ring-primary font-semibold text-[18px] rounded-md cursor-pointer">
              <option value="">ทั้งหมด</option>
              <option value={statusOptions.pending}>รอพิจารณา</option>
              <option value={statusOptions.approved}>อนุมัติ</option>
              <option value={statusOptions.rejected}>ปฏิเสธ</option>
          </select>
      </div>
      <button type="submit"
          class="px-10 py-1.5 bg-primary focus:border-primary focus:ring-primary font-semibold text-white text-[18px] rounded-md cursor-pointer">
          ค้นหา
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
  		<tbody class="divide-y divide-gray-300">
  			{#each applications as app (app.id)}
  				<tr class="">
  					<td class=" p-4">{app.user.firstName} {app.user.lastName}</td>
  					<td class=" p-4">{app.user.student_id}</td>
  					<td class=" p-4">{app.user.department.name}</td>
  					<td class=" p-4">{app.award.name}</td>
  					<td class=" p-4">
              {#if app.level === currentLevel && app.status === "REJECTED"}
                <div class="w-fit rounded-full border border-red-400 bg-red-50 px-3 py-1 text-sm text-red-400">
                  ปฏิเสธ
                </div>
              {:else if app.level >= currentLevel}
                <div class="w-fit rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm text-emerald-400">
                  อนุมัติ
                </div>
              {:else}
                <div class="w-fit rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1 text-sm text-yellow-400">
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
  							<Icon name="eye" size={25} />
  							<p>ดูรายละเอียด</p>
  						</a>
  					</td>
  				</tr>
  			{:else}
  				<tr class="divide-x">
            <td colspan="7" class="px-6 py-32 text-center text-slate-500">
              ไม่พบข้อมูล
            </td>
          </tr>
  			{/each}
  		</tbody>
  	</table>
  </div>
  <div class="w-full flex flex-row justify-end items-center mt-4">
    <div class="flex flex-row items-center gap-x-5">
        <button
            onclick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Icon name="arrow-head-left" class={currentPage === 1 ? 'stroke-gray-300' : ''} />
        </button>

        <p class="border border-slate-300 rounded-xl py-2 px-5">
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
