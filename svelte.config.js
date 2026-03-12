import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
      adapter: adapter({
			bodySizeLimit: 1024 * 1024 * 10
		})
  }
};
