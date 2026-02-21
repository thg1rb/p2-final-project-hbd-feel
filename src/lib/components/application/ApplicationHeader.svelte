<script lang="ts">
	export let role: string;
	export let desc: string;
</script>

<div class="flex flex-col gap-2">
	<p class="text-2xl font-bold">แดชบอร์ด{role}</p>
	<p class=" text-gray-400">
		{desc}
	</p>
</div>
