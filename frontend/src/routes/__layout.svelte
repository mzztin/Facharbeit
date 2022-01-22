<script lang="ts" context="module">
	import Header from "$lib/components/Header.svelte";
	import store from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Content } from "carbon-components-svelte";
	import "carbon-components-svelte/css/g90.css";


	axios.defaults.withCredentials = true;

	export const load: Load = async ({ fetch }) => {	
		try {
			const res = await axios.get("http://localhost:4000/users/@me", {
				method: "GET"
			});

			const data = res.data;

			if (res.status == 401) {
				return {
					props: {
						isLoggedIn: false
					}
				}
			}

			return {
				props: {
					isLoggedIn: true,
					username: data.username,
					sessionId: data.sessionId
				}
			};
		} catch (e) {
			return {
					props: {
						isLoggedIn: false,
						username: undefined,
						sessionId: undefined
					}
			}
		}

	};
</script>

<script lang="ts">	
	
	export let username: string | undefined;

	export let sessionId: string | undefined;

	export let isLoggedIn: boolean;

	if (username) store.username.set(username);
	if (sessionId) store.sessionId.set(sessionId);
	if (isLoggedIn) store.loggedIn.set(isLoggedIn);

	console.log("layout", { username, sessionId, isLoggedIn });
</script>

<Header {isLoggedIn} {username} />

<Content>
	<slot />
</Content>
