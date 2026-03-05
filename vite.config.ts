import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    port: 3000
  },
  
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'], // 'lcov' สำคัญมากสำหรับ SonarQube
      reportsDirectory: './coverage'
    }
  }

});
