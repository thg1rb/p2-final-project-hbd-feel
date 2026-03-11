<script lang="ts">
    import googleLogo from '$lib/assets/images/google.png';
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    import { toastStack } from '$lib/stores/toast.svelte';
    import type { ActionData } from './$types';
	import Icon from '$lib/components/Icon.svelte';
    import { PUBLIC_OAUTH_URI } from '$env/static/public';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);
    let showPassword = $state(false);

    const handleLogin: SubmitFunction = () => {
        isLoading = true;

        return async ({ update }) => {
            await update();
            isLoading = false;
        };
    };

    onMount(() => {
        if (window.location.hash === '#notFound') {
            toastStack.add("ไม่พบผู้ใช้ กรุณาติดต่อผู้ดูแลระบบ", 'error', 3000);
        }
    });
</script>

<div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
                <Icon name="award" class="text-white" size={32} />
            </div>
            <h1 class="text-3xl font-bold mb-2">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">ระบบนิสิตดีเด่น</span>
            </h1>
            <p class="text-gray-600">โปรดเข้าสู่ระบบเพื่อสมัครหรือพิจารณานิสิตดีเด่น</p>
            <a href="/award-result" class="text-green-600 underline" target="_blank">หรือคลิกเพื่อดูรายชื่อนิสิตที่ได้รับรางวัล</a>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <!-- Google Login Button -->
            <button
                onclick={() => {
                    window.location.href = PUBLIC_OAUTH_URI;
                }}
                class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-medium hover:border-green-400 hover:bg-green-50 transition-all duration-200 hover:shadow-md group"
                disabled={isLoading}
            >
                <img src={googleLogo} alt="Google" class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>ดำเนินการด้วย Google</span>
            </button>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-6">
                <div class="flex-1 h-px bg-gray-200"></div>
                <span class="text-gray-400 text-sm font-medium">หรือ</span>
                <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <!-- Login Form -->
            <form action="?/login" method="POST" use:enhance={handleLogin} class="space-y-5">
                <!-- Credential Input -->
                <div>
                    <label for="credential" class="block text-sm font-semibold text-gray-700 mb-2">
                        ชื่อผู้ใช้ หรืออีเมล
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                            name="credential"
                            id="credential"
                            placeholder="name.lastName@ku.th"
                            disabled={isLoading}
                            required
                            autocomplete="username"
                        />
                    </div>
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                        รหัสผ่าน
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            class="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                            name="password"
                            id="password"
                            disabled={isLoading}
                            required
                            autocomplete="current-password"
                        />
                        <button
                            type="button"
                            onclick={() => (showPassword = !showPassword)}
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                        >
                            {#if showPassword}
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            {:else}
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            {/if}
                        </button>
                    </div>
                    {#if form?.errors?.credential}
                        <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {form.errors.credential[0]}
                        </p>
                    {/if}
                    {#if form?.errors?.password}
                        <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {form.errors.password[0]}
                        </p>
                    {/if}
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {#if isLoading}
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>กำลังเข้าสู่ระบบ...</span>
                    {:else}
                        <span>เข้าสู่ระบบ</span>
                        <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    {/if}
                </button>
            </form>

            <!-- Forgot Password Link -->
            <div class="mt-6 text-center">
                <a href="/forgot-password" class="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors">
                    <span>ลืมรหัสผ่าน?</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>
