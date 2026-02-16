import { browser } from '$app/environment';
import { PUBLIC_BROWSER_API_BASE_URL, PUBLIC_DOCKER_API_BASE_URL } from '$env/static/public';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: browser
    ? PUBLIC_BROWSER_API_BASE_URL
    : PUBLIC_DOCKER_API_BASE_URL,
  timeout: 15000,
});
