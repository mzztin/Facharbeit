<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ page }) => {
		return {
			props: {
				roomId: page.params.roomId
			}
		};
	};
</script>

<script lang="ts">
	export const roomId: string = "";

	import { Row, Column } from "carbon-components-svelte";

	import Message from "$lib/components/Message.svelte";
</script>

<Row>
	<Column>
		<h1>Room - {roomId}</h1>
	</Column>

	<Column>
		<Message
			username="Martin"
			content="Sup"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(99676556436)}
		/>
		<Message
			username="Martin"
			content="Hru"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(696765556436)}
		/>
		<Message
			username="Martin"
			content="wtf"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(696765556436)}
		/>
		<Message
			username="Martin"
			content="wtf"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(696765556436)}
		/>
		<Message
			username="Martin"
			content="wtf"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(696765556436)}
		/>
		<Message
			username="Martin"
			content="wtf"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(696765556436)}
		/>
		<Message
			username="Martin"
			content="wtf"
			avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
			createdAt={new Date(696765556436)}
		/>
	</Column>
</Row>
