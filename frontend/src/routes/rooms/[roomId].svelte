<script lang="ts" context="module">
	import Message from "$lib/components/Message.svelte";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
import axios from "axios";
	import { Column,Row } from "carbon-components-svelte";
	import { io } from "socket.io-client";
	import { onMount } from "svelte";

	export const load: Load = ({ page }) => {
		return {
			props: {
				roomId: page.params.roomId
			}
		};
	};

</script>

<script lang="ts">
	export let roomId: string = "";
	const socketURL = "ws://localhost:4001"
	
	console.log(roomId)

	const fetchMessages = async () => {
		axios.get("http://localhost:4000/rooms")
	}

	onMount(async () => {
		console.log("socket start")

		const socket = io(socketURL + `?sessionId=${Getter.getSessionID()}&roomId=${roomId}`, {
		});

		socket.emit("joinRoom", roomId)
		
		socket.on("error", async (payload) => {
			console.log(payload)
		})

		
	});

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
	</Column>
</Row>
