<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ fetch }) => {
		const res = await fetch("http://localhost:4000/users/me", {
			method: "GET"
		});

		console.log({ res });

		if (res.ok) {
			const json = await res.json();

			console.log({ json });

			return {
				props: {
					username: json,
					isLoggedIn: true
				}
			};
		}

		return {
			props: {
				isLoggedIn: false
			}
		};
	};
</script>

<script lang="ts">
	import Header from "$lib/components/Header.svelte";

	import { Content } from "carbon-components-svelte";

	import "carbon-components-svelte/css/g90.css";

	export let username;

	export let isLoggedIn: boolean;

	console.log("layout", { username, isLoggedIn });
</script>

<Header {isLoggedIn} {username} />

<Content>
	<slot />
</Content>
