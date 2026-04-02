<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { Application, User } from '$lib/type';
	import InfoCard from './InfoCard.svelte';

	interface Props {
		application: Application;
	}

	const { application }: Props = $props();
</script>

<div class="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="user" class="stroke-primary" />
		<p>ข้อมูลนิสิต</p>
	</div>
	<div class="flex gap-3">
		<InfoCard
			title={'ชื่อ-นามสกุล'}
			value={application.user.firstName + ' ' + application.user.lastName}
		/>
		<InfoCard title={'รหัสนิสิต'} value={application.user.student_id} />
	</div>
	<div class="flex gap-3">
		<InfoCard title={'หลักสูตร'} value={application.user.department.name} />
		<InfoCard title={'ชั้นปี'} value={`ปีที่ ${application.year}`} />
	</div>
	<div class="flex flex-col gap-3 md:flex-row">
		<InfoCard title={'เกรดเฉลี่ยสะสม'} value={String(application.grade)} />
		<InfoCard title={'ประเภทรางวัลที่เสนอ'} value={application.award.name} award={true} />
	</div>
</div>
