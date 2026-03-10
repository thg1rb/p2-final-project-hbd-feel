<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { ActionData } from './$types';
    import { toastStack } from '$lib/stores/toast.svelte';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);

    const handleSubmit: SubmitFunction = () => {
        isLoading = true;

        return async ({ update, result }) => {
            await update();
            isLoading = false;

            if (result.type === 'success') {
                toastStack.add('ส่งลิงก์สำเร็จ โปรดเช็กอีเมลของท่าน');
            } else if (result.type === 'failure') {
                toastStack.add('เกิดข้อผิดพลาด กรุณาตรวจสอบและลองใหม่อีกครั้ง', 'error');
            }
        };
    };
</script>

<div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
            <h1 class="text-3xl font-bold mb-2">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">ลืมรหัสผ่าน</span>
            </h1>
            <p class="text-gray-600">โปรดระบุอีเมลของคุณ</p>
        </div>

        <!-- Forgot Password Card -->
        <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <form action="?/forgot_password" method="POST" use:enhance={handleSubmit} class="space-y-5">
                <!-- Email Input -->
                <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                        อีเมล
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <input
                            type="email"
                            class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                            name="email"
                            id="email"
                            disabled={isLoading}
                            placeholder="abcd.ef@ku.th"
                            required
                            autocomplete="email"
                        />
                    </div>
                    {#if form?.errors?.email}
                        <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {form.errors.email[0]}
                        </p>
                    {/if}
                    {#if form?.message}
                        <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            {form.message}
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
                        <span>กำลังส่ง...</span>
                    {:else}
                        <span>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
                        <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    {/if}
                </button>
            </form>

            <!-- Back to Login Link -->
            <div class="mt-6 text-center">
                <a href="/login" class="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    <span>กลับไปหน้าเข้าสู่ระบบ</span>
                </a>
            </div>
        </div>
    </div>
</div>
