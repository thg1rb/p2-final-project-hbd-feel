<script>
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ApproveSection from './ApproveSection.svelte';
	import Award from './Award.svelte';
	import CommentSection from './CommentSection.svelte';
	import InfoCard from './InfoCard.svelte';
	import NisitInfo from './NisitInfo.svelte';
	import Progression from './Progression.svelte';
	import Qualification from './Qualification.svelte';

	$: id = $page.params.id;
</script>

<div class="bg-background p-10">
	<button type="button" class="button-effect mb-10 flex gap-2" onclick={() => history.back()}>
		<Icon name="arrow-left" />
		<p>กลับหน้าก่อนหน้า</p>
	</button>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-start gap-3">
			<p class="text-2xl font-bold">NOM-2568-001</p>
			<div class=" rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-amber-400">
				รอพิจารณา
			</div>
		</div>
		<p class=" text-gray-400">ยื่นเมื่อ 15 ธันวาคม 2568</p>
	</div>
	<div class=" mt-7 flex gap-6">
		<div class="flex flex-2 flex-col gap-6">
			<NisitInfo />
			<Qualification />
			<Award />
			<CommentSection />
		</div>
		<div class="flex flex-1 flex-col gap-6">
			<Progression />
			<ApproveSection />
		</div>
	</div>
</div>
