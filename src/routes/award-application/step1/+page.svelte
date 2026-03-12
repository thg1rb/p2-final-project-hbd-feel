<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const awards = data.awards ?? [];

	let selectedAward: number | null = null;
	let loading = false;
	let errors: Record<string, string[]> = {};

	function submitForm() {
		if (!selectedAward) {
			errors = {
				award_id: ['กรุณาเลือกประเภทรางวัล']
			};
			return;
		}

		window.location.href = `/award-application/step2?award_id=${selectedAward}`;
	}
</script>
	<div class="mb-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-1">
			เลือกประเภทรางวัล
		</h3>
		<p class="text-sm text-gray-500">
			เลือกประเภทรางวัลที่ตรงกับความสามารถและผลงานของคุณ (เลือกได้ 1 ประเภท)
		</p>
	</div>

	<div class="space-y-4">
		{#each awards as award (award.id)}
			<label
				for={"award_" + award.id}
				class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
			>
				<input
					id={"award_" + award.id}
					type="radio"
					name="award_id"
					bind:group={selectedAward}
					value={award.id}
					class="text-emerald-600"
				/>

				<div>
					<p class="font-medium text-gray-900">
						{award.name}
					</p>
				</div>
			</label>
		{/each}

		{#if errors.award_id}
			<p class="text-red-500 text-sm">
				{errors.award_id[0]}
			</p>
		{/if}
	</div>

	<div class="mt-10 flex justify-end">
		<button
			type="button"
			on:click={submitForm}
			disabled={loading}
			class="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition"
		>
			{loading ? 'กำลังบันทึก...' : 'ถัดไป >'}
		</button>
	</div>