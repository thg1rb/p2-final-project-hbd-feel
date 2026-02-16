import { browser } from '$app/environment';
// import { PUBLIC_API_BASE_URL } from '$env/static/public';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: browser
    ? 'http://localhost/api'
    : 'http://host.docker.internal/api',
  timeout: 15000,
});
