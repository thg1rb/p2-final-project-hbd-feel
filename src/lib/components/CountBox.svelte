<script lang="ts">
    // import { title } from './store.js';
    export let title
    // export let icon
    export let textColor = "#000000"
    export let amount = "0"
    export let icon = ""
    export let iconPrimary = "#ffffff"
    export let iconSecondary = "#ffffff"
    import Icon from "./Icon.svelte";
</script>
<div class="rounded-2xl w-70 h-30 bg-white p-6 shadow-md">
    <div class="flex justify-between">
        <div class="flex flex-col gap-4">
            <p class="text-gray-500 text-sm">{title}</p>
            <p class="text-4xl" style="color: {textColor}">{amount}</p>
        </div>
        <div class="flex justify-center items-center">
            <div class="size-14 flex justify-center items-center p-2 rounded-2xl" style="background-color: {iconSecondary};">
                <Icon name={icon} size=36 currentColor={iconPrimary}></Icon>
            </div>
        </div>
    </div>
</div>