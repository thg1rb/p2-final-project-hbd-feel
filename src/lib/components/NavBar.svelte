<script>
	import Icon from './Icon.svelte';
	import { page } from '$app/stores';
	import LogoutButton from './logout-button.svelte';
	import { roleMapUserRole } from '$lib/enums';
	import AuthDropDown from './AuthDropDown.svelte';
	let user = $derived($page.data.user);
	console.log(user);
</script>

{#if user}
	<nav class="border-b border-gray-100 bg-white p-3 shadow-md">
		<!-- Primary Navigation Menu -->
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<a href={`${$page.data?.user?.role === "NISIT" ? "/my-awards" : "/application-list"}`}>
					<div class="flex gap-3">
						<!-- Logo -->
						<!-- <div class="flex shrink-0 items-center">
						<a> </a>
					</div> -->

						<div class=" flex items-center justify-center rounded-xl bg-primary p-3">
							<Icon name="badge" size={24} class="stroke-white"></Icon>
						</div>

						<!-- Navigation Links -->
						<!-- <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
						<x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">

						</x-nav-link>
					</div> -->

						<div class="font-thai flex flex-col gap-1">
							<p class=" font-bold">นิสิตดีเด่น</p>
							<p class="text-sm">มหาวิทยาลัยเกษตรศาสตร์</p>
						</div>
						<!-- {#if $page.data?.user?.role == "NISIT"}
							<a href="/my-awards" class="mx-10 flex justify-center items-center">
								<div class=" p-3 rounded-full hover:text-blue-500 text-lg">
									<p>รางวัลของฉัน</p>
								</div>
							</a>
						{/if} -->

					</div>
				</a>

				<!-- Settings Dropdown -->
				<div class="hidden sm:ms-6 sm:flex sm:items-center">
					<div class="flex items-center justify-center gap-3">
						<p class="rounded-full bg-[#2e3336] p-3 text-sm text-white">
							{user.role}
							<!-- @if (Auth::check() && Auth::user()->role === App\Enums\UserRole::ADMIN) ผู้ดูแลระบบ
						@endif -->
						</p>
						<p class=""></p>
					</div>

					<!-- <x-dropdown align="right" width="48">
					<x-slot name="trigger">
						<button
							class="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
						>
							<div class="ms-1">
								<svg
									class="h-4 w-4 fill-current"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</button>
					</x-slot>

					<x-slot name="content">
						<x-dropdown-link :href="route('profile.edit')"> </x-dropdown-link>

						Authentication
						<form method="POST">
							@csrf

							<x-dropdown-link :href="route('logout')"
                                onclick="event.preventDefault();
                                                this.closest('form').submit();">

                            </x-dropdown-link>
						</form>
					</x-slot>
				</x-dropdown> -->
					<!-- <LogoutButton /> -->
					<AuthDropDown />
				</div>

				<!-- Hamburger -->
				<div class="-me-2 flex items-center sm:hidden">
					<button
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
					>
						<svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
							<!-- <path :class="{ 'hidden': open, 'inline-flex': !open }" class="inline-flex"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" /> -->
							<path
								class="hidden"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Responsive Navigation Menu -->
		<div class="hidden sm:hidden">
			<div class="space-y-1 pt-2 pb-3">
				<x-responsive-nav-link :href="route('main')" :active="request()->routeIs('main')">
					<!-- {{ __('Dashboard') }} -->
				</x-responsive-nav-link>
			</div>

			<!-- Responsive Settings Options -->
			<div class="border-t border-gray-200 pt-4 pb-1">
				<div class="px-4">
					<!-- {{-- <div class="font-medium text-base text-gray-800">{{ Auth::user()->name }}</div>
                <div class="font-medium text-sm text-gray-500">{{ Auth::user()->email }}</div> --}} -->
				</div>

				<div class="mt-3 space-y-1">
					<!-- <x-responsive-nav-link :href="route('profile.edit')">
                    {{ __('Profile') }}
                </x-responsive-nav-link> -->

					<!-- Authentication -->
					<form method="POST">
						@csrf

						<!-- <x-responsive-nav-link :href="route('logout')"
                        onclick="event.preventDefault();
                                        this.closest('form').submit();">

                    </x-responsive-nav-link> -->
					</form>
				</div>
			</div>
		</div>
	</nav>
{/if}
