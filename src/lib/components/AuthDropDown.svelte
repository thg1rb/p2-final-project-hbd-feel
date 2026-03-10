<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import LogoutButton from './logout-button.svelte';
	import { onDestroy, onMount } from 'svelte';
    import { page } from '$app/stores';

	let open = false;
	let wrapper: HTMLDivElement;

	function toggle() {
		open = !open;
	}

</script>

<div class="relative" bind:this={wrapper}>
	<!-- Avatar Button -->
	<button
		on:click|stopPropagation={toggle}
		class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition hover:cursor-pointer"
	>
		<div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
			👤
		</div>
		<span class="text-sm font-medium">{$page.data.user?.name }</span>
	</button>

	<!-- Dropdown -->
	{#if open}
		<div
			in:scale={{ duration: 120 }}
			out:fade={{ duration: 100 }}
			class="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-2 z-50 px-2"
		>
        <a
            href="/profile"
            class="block px-4 py-2 text-sm hover:bg-gray-100 transition"
        >
            โปรไฟล์
        </a>
        
        <a
            href="/change-password"
            class="block px-4 py-2 text-sm hover:bg-gray-100 transition"
        >
            เปลี่ยนรหัสผ่าน
        </a>
        
        <div class="border-t my-1 mb-2"></div>
            
        <div class="flex flex-col justify-center items-center">
			<LogoutButton />
        </div>
		</div>
	{/if}
</div>
