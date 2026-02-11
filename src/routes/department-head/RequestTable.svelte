<script>
	import Icon from '$lib/components/Icon.svelte';
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
			<tr class="">
				<td class=" p-4">บวรไบ้</td>
				<td class=" p-4">6610405928</td>
				<td class=" p-4">วิทยาการคอมพิวเตอร์</td>
				<td class=" p-4">รางวัลนิสิตหล่อดีเด่น</td>
				<td class=" p-4">
					<div
						class="w-fit rounded-full border border-amber-400 bg-amber-50 px-3 py-1 text-sm text-amber-400"
					>
						รอพิจารณา
					</div>
				</td>
				<td class=" p-4">15 มกราคม 2568</td>
				<td class=" p-4">
					<a
						href="/"
						class="button-effect flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-300 p-2"
					>
						<Icon name="eye" size={25} />
						<p>ดูรายละเอียด</p>
					</a>
				</td>
			</tr>
			<tr class="">
				<td class=" p-4">บวรไบ้</td>
				<td class=" p-4">6610405928</td>
				<td class=" p-4">วิทยาการคอมพิวเตอร์</td>
				<td class=" p-4">รางวัลนิสิตหล่อดีเด่น</td>
				<td class=" p-4">
					<div
						class="w-fit rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm text-primary"
					>
						หัวหน้าภาควิชาเห็นชอบ

					</div>
				</td>
				<td class=" p-4">15 มกราคม 2568</td>
				<td class=" p-4">
					<a
						href="/"
						class="button-effect flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-300 p-2"
					>
						<Icon name="eye" size={25} />
						<p>ดูรายละเอียด</p>
					</a>
				</td>
			</tr>
		</tbody>
	</table>
</div>
