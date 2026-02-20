<script lang="ts">
	import { onMount } from "svelte";
	import { awards } from "$lib/data/awardApplication";

	let awardId: number | null = null;
	let awardName: string = "";
	let documents: string[] = [];

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		awardId = Number(params.get("award_id"));

		const award = awards.find(a => a.id === awardId);
		if (award) {
			awardName = award.name;
		}

		documents = [
			"document1.pdf",
			"transcript.pdf",
			"id-card.jpg"
		];
	});
</script>

<div class="max-w-3xl mx-auto">

	<div class="mb-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-1">
			ตรวจสอบและยืนยัน
		</h3>
		<p class="text-sm text-gray-500">
			กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนส่งใบสมัคร
		</p>
	</div>

	<div class="bg-gray-50 border rounded-lg p-6 space-y-4 mb-6">

		<div>
			<p class="text-sm text-gray-500">ประเภทรางวัล</p>
			<p class="font-medium text-gray-900">
				{awardName}
			</p>
		</div>

		<div>
			<p class="text-sm text-gray-500">ไฟล์แนบ</p>

			{#if documents.length}
				<ul class="mt-2 space-y-1">
					{#each documents as doc}
						<li class="flex items-center gap-2 text-gray-900">
							📎 {doc}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-400 mt-2">ไม่มีไฟล์แนบ</p>
			{/if}
		</div>

	</div>

	<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
		<p class="text-sm text-yellow-800 flex items-center gap-2">
			<span>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
						  stroke="#D48B00"
						  stroke-width="1.5"
						  stroke-linecap="round"
						  stroke-linejoin="round"/>
				</svg>
			</span>

			<span>
				เมื่อส่งใบสมัครแล้ว จะไม่สามารถแก้ไขข้อมูลได้
				กรุณาตรวจสอบความถูกต้องก่อนยืนยัน
			</span>
		</p>
	</div>

    <div class="mt-10 flex justify-between">
        <a
            href={`/award-application/step2?award_id=${awardId}`}
            class="px-6 py-2 border rounded-lg"
        >
            &lt; ย้อนกลับ
        </a>

        <button
            class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
            ส่งแบบฟอร์ม
        </button>
    </div>

</div>