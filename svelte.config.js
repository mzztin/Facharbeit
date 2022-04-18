import { optimizeImports } from "carbon-preprocess-svelte";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), optimizeImports()],
	kit: {
		ssr: false,
		vite: {},
		// hydrate the <div id="svelte"> element in src/app.html
		target: "#svelte"
	}
};

export default config;
