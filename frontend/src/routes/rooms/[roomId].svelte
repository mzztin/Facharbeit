<script lang="ts" context="module">
	import { goto } from "$app/navigation";
	import MessageComponent from "$lib/components/Message.svelte";
	import type { Message, MessageWithUser, Room } from "$lib/types/rooms";
	import api from "$lib/utils/cached-api";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { TextInput } from "carbon-components-svelte";
	import moment from "moment";
	import { io, Socket } from "socket.io-client";

	export const load: Load = async ({ page }) => {
		const roomId = page.params.roomId;
		const roomData = await axios.get(`/rooms/${roomId}`);

		if (roomData.status >= 400) {
			return {
				props: {
					isValid: false
				}
			};
		}

		axios.post(`/users/joinedRoom/${roomId}`);

		return {
			props: {
				roomData: roomData.data,
				isValid: true
			}
		};
	};
</script>

<script lang="ts">
	export let roomData: Room;
	export let isValid: boolean = undefined;

	const socketURL = `http://localhost:4002`;
	let socket: Socket;

	let messages: Message[] = [];
	let ownerUsername: string | undefined;

	if (isValid) {
		(async () => {
			const owner = await axios.get(`/users/${roomData.ownerId}}`);
			ownerUsername = owner.data.username;

			let msgs = await fetchMessages();
			msgs = msgs.sort((a, b) => a.id - b.id);

			for (const msg of msgs) {
				console.log(JSON.stringify(msg));
				addMessage(msg);
			}

			socket = io(`http://192.168.1.53:4002`, {
				reconnection: true,
				query: {
					sessionId: Getter.getSessionID(),
					roomId: roomData.code
				}
			});

			socket.emit("joinRoom", roomData.code);

			socket.on("userJoined", async (payload) => {
				console.log(payload);
			});

			socket.on("reload_page", () => {
				goto(`/rooms/${roomData.code}`);
			});

			socket.on("connect_error", (err) => {
				console.log(`connect_error due to ${err.message}`);
			});

			socket.on("recieveMessage", async (payload) => {
				addMessage(payload as Message);
			});
		})();
	}

	let value: string = "";

	const addMessage = async (data: Message) => {
		messages.unshift(data);

		// reassign => https://stackoverflow.com/questions/70099100/how-would-i-make-an-each-loop-in-svelte-reactive
		messages = messages;
	};

	const refreshMessages = (msgs: MessageWithUser[]) => {
		return msgs.sort((a, b) => b.id - a.id);
	};

	const fetchMessages = async () => {
		return (await axios.get(`/rooms/${roomData.code}/messages`)).data as Message[];
	};

	const submit = async () => {
		if (value == "" || value == undefined) {
			value = "";
			return;
		}

		socket.emit("sendMessage", value);

		value = "";
	};

	const fetchUserData = async (userId: number) => {
		return (await api.get(`/users/${userId}`)).data;
	};
</script>

{#if isValid}
	<div class="information">
		<h2>Chatroom - {roomData.name}</h2>
		<h5>ID: {roomData.code}</h5>
		<h5>Created at {moment(new Date(roomData.createdAt)).format("LLL")}</h5>
		<h5>Owner: <a class="custom-hover" href={`/users/${ownerUsername}`}>{ownerUsername}</a></h5>
	</div>

	<br class="split" />

	<div class="message-container">
		{#each messages as message}
			{#await fetchUserData(message.senderId) then val}
				<MessageComponent {message} sender={val} />
			{/await}
		{/each}
	</div>

	<br />

	<TextInput
		placeholder="Enter message"
		on:keydown={(event) => {
			if (event.code == "Enter") submit();
		}}
		bind:value
	/>
{:else}
	<h3>Room with code <b>{roomData.code}</b> not found!</h3>
	<br />

	<h3>Click one of these links to return:</h3>
	<br />

	<a class="hover-href" href="/"><h4>Return to homepage</h4></a>
	<br />

	<h5>OR</h5>

	<br />
	<a class="hover-href" href="/rooms"><h4>Return to room hub</h4></a>
{/if}

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
