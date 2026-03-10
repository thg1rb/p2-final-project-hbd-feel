<script lang="ts">
	import Icon from './Icon.svelte';
	import { page } from '$app/stores';
	import LogoutButton from './logout-button.svelte';
	import AuthDropDown from './AuthDropDown.svelte';
	import { fade } from 'svelte/transition';

	let user = $derived($page.data.user);
	let mobileMenuOpen = $state(false);

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

{#if user}
	<!-- Spacer so page content isn't hidden behind the fixed nav -->
	<div class="h-[73px]"></div>

	<!-- Overlay backdrop -->
	{#if mobileMenuOpen}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden"
			onclick={closeMobileMenu}
			aria-hidden="true"
		></div>
	{/if}

	<nav class="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white shadow-sm">
		<!-- Main bar -->
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-[73px] items-center justify-between">

				<!-- Logo / Brand -->
				<a
					href={user.role === 'NISIT' ? '/my-awards' : '/application-list'}
					class="flex items-center gap-3"
				>
					<div class="flex items-center justify-center rounded-xl bg-primary p-3">
						<Icon name="badge" size={24} class="stroke-white" />
					</div>
					<div class="font-thai flex flex-col gap-0.5">
						<p class="font-bold leading-tight">นิสิตดีเด่น</p>
						<p class="text-sm leading-tight text-gray-500">มหาวิทยาลัยเกษตรศาสตร์</p>
					</div>
				</a>

				<!-- Desktop: Role badge + Auth Dropdown -->
				<div class="hidden sm:flex sm:items-center sm:gap-3">
					<span class="rounded-full bg-[#2e3336] px-4 py-2 text-sm text-white">
						{user.role}
					</span>
					<AuthDropDown />
				</div>

				<!-- Mobile: Hamburger button -->
				<button
					onclick={toggleMenu}
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpen}
					class="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none sm:hidden"
				>
					<span class="hamburger" class:open={mobileMenuOpen}>
						<span></span>
						<span></span>
						<span></span>
					</span>
				</button>
			</div>
		</div>

		<!-- Mobile Sliding Menu -->
		<div
			class="mobile-menu overflow-hidden border-t border-gray-100 sm:hidden"
			style:max-height={mobileMenuOpen ? '480px' : '0px'}
			style:opacity={mobileMenuOpen ? '1' : '0'}
		>
			<div class="bg-white px-4 pt-4 pb-6 space-y-4">

				<!-- User card -->
				<div class="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2e3336] text-base">
						👤
					</div>
					<div class="min-w-0">
						<p class="truncate text-sm font-semibold text-gray-800">{user.name ?? ''}</p>
						<span class="inline-block rounded-full bg-[#2e3336] px-2 py-0.5 text-xs text-white">
							{user.role}
						</span>
					</div>
				</div>

				<!-- Nav links -->
				<nav class="space-y-1">
					<a
						href={user.role === 'NISIT' ? '/my-awards' : '/application-list'}
						onclick={closeMobileMenu}
						class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
					>
						<Icon name="badge" size={18} class="stroke-gray-500" />
						{user.role === 'NISIT' ? 'รางวัลของฉัน' : 'รายการสมัคร'}
					</a>

					<a
						href="/profile"
						onclick={closeMobileMenu}
						class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
					>
						<svg class="h-[18px] w-[18px] stroke-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
						</svg>
						โปรไฟล์
					</a>

					<a
						href="/change-password"
						onclick={closeMobileMenu}
						class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
					>
						<svg class="h-[18px] w-[18px] stroke-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
						</svg>
						เปลี่ยนรหัสผ่าน
					</a>
				</nav>

				<!-- Divider -->
				<div class="border-t border-gray-100"></div>

				<!-- Logout -->
				<div class="px-1" onclick={closeMobileMenu} role="presentation">
					<LogoutButton />
				</div>
			</div>
		</div>
	</nav>
{/if}

<style>
	/* Smooth slide animation */
	.mobile-menu {
		transition: max-height 0.3s ease, opacity 0.3s ease;
		will-change: max-height, opacity;
	}

	/* Animated hamburger → X */
	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
		gap: 4px;
	}

	.hamburger span {
		display: block;
		width: 20px;
		height: 2px;
		background-color: currentColor;
		border-radius: 2px;
		transition: transform 0.25s ease, opacity 0.2s ease, width 0.2s ease;
		transform-origin: center;
	}

	/* Open state: morph into X */
	.hamburger.open span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}
	.hamburger.open span:nth-child(2) {
		opacity: 0;
		width: 0;
	}
	.hamburger.open span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}
</style>
