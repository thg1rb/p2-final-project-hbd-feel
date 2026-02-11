<script>
	import Icon from '$lib/components/Icon.svelte';
</script>

<div class="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="trophy" class="stroke-primary" />
		<p>รางวัล (รายการที่ได้รับระดับสูงสุด)</p>
	</div>
	<ul class="flex list-inside list-disc flex-col gap-3 marker:text-primary">
		<li>รับรางวัลเมื่อ 25 มกราคม 2569</li>
		<li>โครงการ เยวชนต้านภัยยาเสพติด</li>
		<li>ชื่อทีม CS รักพี่เต้ 007</li>
		<li>ชื่อผลงาน เครื่องผลิตไดโนเสาร์</li>
		<li>ได้รับรางวัลชนะเลิศ</li>
		<li>จัดโดยกระทรวงเวทย์มนต์</li>
	</ul>
</div>
