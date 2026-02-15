import { apiClient } from "$lib/api";
import type { Application } from "$lib/type";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const response = await apiClient.get('/applications')
    return {
      applications: response.data.data as Application[]
    }
  } catch (error: any) {
    console.error('--- LOG START ---');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    console.error('--- LOG END ---');

    return {
      applications: [],
      error: error.message // ส่ง error message จริงไปแสดงที่หน้าจอด้วย
    };
  }
}