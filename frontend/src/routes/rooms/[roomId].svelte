<script lang="ts" context="module">
	import { goto } from "$app/navigation";
	import MessageComponent from "$lib/components/Message.svelte";
	import type { Message,Room } from "$lib/types/rooms";
	import api from "$lib/utils/cached-api";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { TextInput } from "carbon-components-svelte";
	import moment from "moment";
	import { io,Socket } from "socket.io-client";
	import { onMount } from "svelte";

	export const load: Load = async ({ page }) => {
		const roomId = page.params.roomId;
		try {
			const roomData = await axios.get(`/rooms/${roomId}`);

			if (roomData.status >= 400) goto("/rooms/not_found");
			axios.post(`/users/joinedRoom/${roomId}`);
			return { props: { roomData: roomData.data }};
		} catch (e) {
			goto("/rooms/not_found");
		}
	};
</script>

<script lang="ts">
	export let roomData: Room;
	let socket: Socket;
	let messages: Message[] = [];
	let ownerUsername: string | undefined;
	onMount(async () => {
		const owner = await axios.get(`/users/${roomData.ownerId}}`);
		ownerUsername = owner.data.username;
		
		let msgs = await fetchMessages();
		msgs = msgs.sort((a, b) => a.id - b.id);
		for (const msg of msgs) {
			addMessage(msg);
		}

		socket = io(`http://192.168.1.53:4002`, { reconnection: true, query: { sessionId: Getter.getSessionID(), roomId: roomData.code } });
		socket.emit("joinRoom", roomData.code);
		socket.on("reload_page", () => goto(`/rooms/${roomData.code}`));

		socket.on("connect_error", (err) => console.log(`connect_error due to ${err.message}`));

		socket.on("recieveMessage", async (payload) => addMessage(payload as Message));
	});
	let textBoxValue: string = "";
	const addMessage = async (data: Message) => {
		messages.unshift(data);
		messages = messages; // reassign => https://stackoverflow.com/questions/70099100/how-would-i-make-an-each-loop-in-svelte-reactive
	};

	const fetchMessages = async () => { return (await axios.get(`/rooms/${roomData.code}/messages`)).data as Message[];};

	const submit = async () => {
		if (textBoxValue == "" || textBoxValue == undefined) {
			textBoxValue = "";
			return;
		}
		socket.emit("sendMessage", textBoxValue);
		textBoxValue = "";
	};

	const fetchUserData = async (userId: number) => { return (await api.get(`/users/${userId}`)).data;};
</script>

<div class="information">
	<h2>Chatroom - {roomData.name}</h2>
	<h5>ID: {roomData.code}</h5>
	<h5>Created at {moment(new Date(roomData.createdAt)).format("LLL")}</h5>
	<h5>Owner: <a class="custom-hover" href={`/users/${ownerUsername}`}>{ownerUsername}</a></h5>
</div>
<br class="split" />
<div class="message-container">
	{#each messages as message}
		{#await fetchUserData(message.senderId) then val}<MessageComponent {message} sender={val} />{/await}
	{/each}
</div>

<br />

<TextInput
	placeholder="Enter message"
	on:keydown={(event) => { if (event.code == "Enter") submit();}}
	bind:value={textBoxValue}
/>

<style>
	.information {
		display: flex;
		flex-direction: column;
		column-gap: 20px;
	}

	.message-container {
		display: flex;
		flex-direction: column;
		column-gap: 20px;
		overflow: auto;
		height: 600px;
		width: auto;
		scroll-behavior: smooth;
		overflow-y: auto;
		flex-flow: column-reverse;
	}

	.split {
		line-height: 30px;
	}
</style>
