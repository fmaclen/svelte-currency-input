import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	test: {
		environment: 'node',
		include: ['tests/unit/**/*.{test,spec}.{js,ts}']
	}
});
