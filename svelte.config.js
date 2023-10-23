import cloudFlare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: cloudFlare({
			// REF https://github.com/sveltejs/kit/blob/fd6eb9b152001a537f4277a9e597aa24405a51af/documentation/docs/25-build-and-deploy/60-adapter-cloudflare.md#usage
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
	}
};

export default config;
