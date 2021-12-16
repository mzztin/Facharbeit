<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page, fetch }) => {
		const userId = page.params.userId;
		let res = await fetch(`http://localhost:4000/users/${userId}`);

		if (res.ok) {
			return {
				props: {
					data: await res.json(),
					userId: page.params.userId
				}
			};
		}

		return {
			error: new Error("Failed fetching data")
		};
	};
</script>

<script lang="ts">
	import Message from "$lib/components/Message.svelte";
	import { Button, Row, TextInput } from "carbon-components-svelte";
	import ArrowRight from "carbon-icons-svelte/lib/ArrowRight24";

	export let userId: string;
	export let data: any;

	let tempoaryText: string = "";

	const send = () => {};
</script>

<Row>
	<TextInput placeholder="Enter text" bind:value={tempoaryText} />

	<Button
		tooltipPosition="right"
		tooltipAlignment="end"
		size="small"
		icon={ArrowRight}
		iconDescription="Send Message"
		on:click={send}
	/>
</Row>
