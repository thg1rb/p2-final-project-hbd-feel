import { homePage } from "$lib/config/homepage";


export function getHomePage(role: string) {
    return homePage[role] ?? "/";
}