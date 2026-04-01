import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { apiClient } from '$lib/api';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const token = cookies.get('token');
  const path = url.searchParams.get('path');

  if (!path) throw error(400, 'Missing path parameter');

  try {
    const res = await apiClient.get(`/minio/download`, {
      params: { path },
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/pdf'
      }
    });

    if (!res.data || res.data.byteLength === 0) {
      throw new Error('Received empty file data');
    }

    return new Response(new Uint8Array(res.data), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="report.pdf"',
        'Content-Length': res.data.byteLength.toString()
      }
    });

  } catch (e: any) {
    console.error('Proxy Error:', e.message);
    throw error(e.response?.status || 500, 'Failed to stream PDF');
  }
};