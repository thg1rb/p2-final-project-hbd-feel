<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);

    const handleLogin: SubmitFunction = () => {
        isLoading = true;
        
        return async ({ update }) => {
            await update(); 
            isLoading = false; 
        };
    };

    let forced = $state(false);

    onMount(() => {

		if (window.location.hash === '#forced') {
			forced = true;
		}
	});

</script>

<div class="flex flex-col gap-5 right-0 left-0 top-0 bottom-0 bg-gray-50 justify-center items-center w-full h-screen">
    <div class="text-2xl flex flex-col justify-center items-center">
        <p class="text-2xl">ยินดีตอนรับสู่<span class="text-green-600">ระบบนิสิตดีเด่น!</span></p>
        <p class="text-lg">โปรดเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก</p>
    </div>
    <div class="rounded-2xl shadow-lg bg-white px-20 py-10 flex flex-col gap-3 justify-center items-center">
        <!-- <p class="text-2xl mb-5">เข้าสู่ระบบ</p> -->
        <!-- <p>Login</p> -->

        <form action="?/change_password" method="POST" use:enhance={handleLogin} class="space-y-4">
        {#if !forced}    
            <div>
                <label for="old-password" class="block mb-2">
                    รหัสผ่านปัจจุบัน
                </label>
                <input 
                    type="password" 
                    class="rounded-4xl w-80" 
                    name="old-password"
                    id="old-password"
                    disabled={isLoading}
                    required
                >
            </div>
        {/if}

            <div>
                <label for="password" class="block mb-2">
                    รหัสผ่าน
                </label>
                <input 
                    type="password" 
                    class="rounded-4xl w-80" 
                    name="password"
                    id="password"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.password}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.password[0]}
                    </p>
                {/if}
            </div>

            <div>
                <label for="password_confirmation" class="block mb-2">
                    ยืนยันรหัสผ่าน
                </label>
                <input 
                    type="password" 
                    class="rounded-4xl w-80" 
                    name="password_confirmation"
                    id="password_confirmation"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.password_confirmation}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.password_confirmation[0]}
                    </p>
                {/if}
            </div>
            
            <div class="w-full flex justify-center">
                <button class="mt-5 rounded-2xl border py-2 text-white hover:cursor-pointer hover:scale-110 bg-blue-400 w-40"
                    disabled={isLoading}
                >
                    เปลี่ยนรหัสผ่าน
                </button>
            </div>

        </form>
    </div>
</div>