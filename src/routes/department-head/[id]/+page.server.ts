import { apiClient } from '$lib/api.js';
import type { Application } from '$lib/type.js';
import path from 'path';

export const load = async ({ params }) => {
  const id = params.id
  const appResponse = await apiClient.get(`/application/${id}`)
  const application = appResponse.data as Application

  return {
    application: application,
    filePath: application.path,
  };
};