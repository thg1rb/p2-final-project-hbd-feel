<script>
	import Icon from '$lib/components/Icon.svelte';
	import InfoCard from './InfoCard.svelte';
</script>

<div class="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="user" class="stroke-primary" />
		<p>ข้อมูลนิสิต</p>
	</div>
	<div class="flex">
		<InfoCard title={'ชื่อ-นามสกุล'} value={'รักษิต รุ่งรัตนไชย'} />
		<InfoCard title={'รหัสนิสิต'} value={'6610402247'} />
	</div>
	<div class="flex">
		<InfoCard title={'หลักสูตร'} value={'วิทยาการคอมพิวเตอร์'} />
		<InfoCard title={'ชั้นปี'} value={'ปีที่ 3'} />
	</div>
	<div class="flex">
		<InfoCard title={'เกรดเฉลี่ยสะสม'} value={'3.96'} />
		<InfoCard title={'ประเภทรางวัลที่เสนอ'} value={'ด้านวิชาการ'} award={true} />
	</div>
</div>
