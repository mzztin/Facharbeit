<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page, fetch }) => {
		const userId = page.params.userId;
		let res = await fetch(`http://localhost:4000/users/${userId}`);

		if (res.ok) {
			return {
				props: {
					data: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error()
		};
	};
</script>

<script lang="ts">
	export let userId;
	export let data;

	$: data;
</script>

<h1>{userId}</h1>
<code>{JSON.stringify(data)}</code>
