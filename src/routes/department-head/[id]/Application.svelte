<script>
	import Icon from '$lib/components/Icon.svelte';
</script>

<div class="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="trophy" class="stroke-primary" />
		<p>แบบเสนอรายชื่อนิสิตดีเด่น</p>
	</div>
	<div class="mt-5 flex flex-col gap-5">
		<div>
			<p class="font-medium">1. ด้านกิจกรรมนอกหลักสูตร</p>
			<div class="mt-3 rounded-2xl bg-gray-100 p-5">
				<p class="mt-2 text-sm text-gray-600">
					เข้าร่วมแข่งขัน
					ทางวิชาการหรือศิลปวัฒนธรรมระดับอุดมศึกษาระดับชาติหรือระดับนานาชาติและได้รับรางวัลใด
					รางวลัหนึ่งจากการแข่งขัน
				</p>
			</div>
		</div>
		<div>
			<p class="font-medium">
				2. โปรดระบุรายละเอียดผลงานรางวัลหรือคุณลักษณะความดีเด่นที่เกี่ยวข้องกับด้านที่นิสิตสมัคร
				(รายการที่ได้รับระดับสูงสุด)
			</p>
			<ul class=" list-inside list-disc">
				<li class="mt-5 text-sm">
					วันที่ได้รับรางวัล
					<div class="mt-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
						<p>22 ธันวาคม 2569</p>
					</div>
				</li>
				<li class="mt-5 text-sm">
					โครงการที่เข้าแข่งขัน/รายการที่เข้าแข่งขัน
					<div class="mt-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
						<p>สร้างหุ่นยนต์ต่อต้านภัยแป้ง</p>
					</div>
				</li>
				<li class="mt-5 text-sm">
					ชื่อทีม
					<div class="mt-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
						<p>มีหุ่นยนต์ไม่มีเทา คนไม่ใช่หุ่นยนต์พลัส+</p>
					</div>
				</li>
				<li class="mt-5 text-sm">
					ชื่อผลงานที่ได้รับรางวัล
					<div class="mt-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
						<p>หุ่นยนต์ทำลายแป้ง</p>
					</div>
				</li>
				<li class="mt-5 text-sm">
					รางวัลที่ได้รับ
					<div class="mt-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
						<p>ชนะเลิศ</p>
					</div>
				</li>
				<li class="mt-5 text-sm">
					หน่วยงานผู้จัด
					<div class="mt-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
						<p>กระทรวงมันคือแป้ง</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</div>
