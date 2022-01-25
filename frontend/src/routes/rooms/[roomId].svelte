<script lang="ts" context="module">
	import Message from "$lib/components/Message.svelte";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Button,Column,Grid,Row,TextInput } from "carbon-components-svelte";
	import { io,Socket } from "socket.io-client";
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
		const messages = axios.get(`http://localhost:4000/rooms/${roomId}/messages`)
	
	}

	let socket: Socket;

	onMount(async () => {
		socket = io(socketURL + `?sessionId=${Getter.getSessionID()}&roomId=${roomId}`);

		socket.emit("joinRoom", roomId)
		
		socket.on("userJoined", async (payload) => {
			console.log(payload)
		})

		socket.on("recieveMessage", async (payload) => {
			console.log(payload)
		})
	});

	let value: string = "";

	const sendMessage = () => {
		socket.emit("sendMessage", value);
		value = "";
	}

</script>

<Grid>
	<Row>
		<h1>Chatroom - {roomId}</h1>
	</Row>	

	<Row>
		Owner: {roomId}
	</Row>

	<Row>
		<Column>
			<Message
				username="Martin"
				content="Hru"
				avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
				createdAt={new Date(696765556436)}
			/>
		</Column>
	</Row>

	<Row>
		<Column>
			<Message
				username="Martin"
				content="Hru 2"  
				avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
				createdAt={new Date(696765556436)}
			/>
		</Column>
	</Row>

	<Row>
		<Column>
			<Message
				username="Martin"
				content="Hru 3"
				avatar={`https://avatars.dicebear.com/api/male/${"Martin"}.svg`}
				createdAt={new Date(696765556436)}
			/>
		</Column>
	</Row>

	<Row>
		
		<Column>
			<TextInput placeholder="Enter message" bind:value />
		</Column>

		<Column>
			<Button kind="ghost" on:click={sendMessage}>Send!</Button>
		</Column>
		
	</Row>
</Grid>