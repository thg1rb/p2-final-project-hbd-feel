<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { Application } from '$lib/type';
	import { formatThaiDate } from '$lib/utils/dateFormatter';

	interface Props {
		applications: Application[];
	}

	let { applications }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl border border-gray-300 bg-white">
	<table class="w-full">
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
						<div
							class="w-fit rounded-full border border-amber-400 bg-amber-50 px-3 py-1 text-sm text-amber-400"
						>
							{app.status === 'SUBMITTED' ? 'รอพิจารณา' : ''}
						</div>
					</td>
					<td class=" p-4">{formatThaiDate(app.created_at)}</td>
					<td class=" p-4">
						<a
							href={`/department-head/${app.id}`}
							class="button-effect flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-300 p-2"
						>
							<Icon name="eye" size={25} />
							<p>ดูรายละเอียด</p>
						</a>
					</td>
				</tr>
			{:else}
				<tbody></tbody>
			{/each}
		</tbody>
	</table>
</div>
