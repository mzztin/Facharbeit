<script lang="ts" context="module">
	import type { Message,Room } from "$lib/types/rooms";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Column,Grid,Row } from "carbon-components-svelte";
	import moment from "moment";
	import { io,Socket } from "socket.io-client";
	import { onMount } from "svelte";

	export const load: Load = async ({ page }) => {
		const roomId = page.params.roomId;
		let roomInfo;

		try {
			roomInfo = await axios.get(`/rooms/${roomId}`);

			console.log({ roomInfo, data: roomInfo.data });
		} catch (e) {
			return {
				props: {
					isValid: false
				}
			};
		}

		console.log({ roomInfo: roomInfo.data });

		if (roomInfo.data == false) {
			return {
				props: {
					roomId,
					isValid: false
				}
			};
		}

		return {
			props: {
				roomId,
				roomInfo: roomInfo.data,
				isValid: true
			}
		};
	};
</script>

<script lang="ts">


	export let roomData: Room;

	export let isValid: boolean = undefined;

	let ownerUsername: string;


	const socketURL = `ws://${"192.168.1.53"}:4001`;

	const fetchMessages = async () => {
		return (await axios.get(`/rooms/${roomData.code}/messages`)).data as Array<Message>;
	};

	let messages: Message[];

	let socket: Socket;

	if (isValid) {
		onMount(async () => {
			const owner = await axios.get(`/users/${roomData.ownerId}}`);
			ownerUsername = owner.data.username;

			messages = await fetchMessages();
			console.log("messages", await fetchMessages())

			socket = io(socketURL + `?sessionId=${Getter.getSessionID()}&roomId=${roomData.code}`);

			socket.emit("joinRoom", roomData.code);

			socket.on("userJoined", async (payload) => {
				console.log(payload);
			});

			socket.on("recieveMessage", async (payload) => {
				console.log(payload);
			});

			// messages = await fetchMessages();
		});
	}

	let value: string = "";

	const addMessage = (data: any = {}) => {
		
		messages.push({
			id: 6,
			senderId: 1,
			content: "hey",
			createdAt: new Date().toISOString(),
			room: roomData
		});

		// reassign => https://stackoverflow.com/questions/70099100/how-would-i-make-an-each-loop-in-svelte-reactive
		messages = messages;
	};

	addMessage();
	addMessage();
	addMessage();
	addMessage();
	addMessage();
	
</script>

{#if isValid}
	<Grid>
		<Row>
			<Column>
				<h1>Chatroom - {roomData.name}</h1>
			</Column>

			<Column>
				<h3>ID: {roomData.code}</h3>
			</Column>

			<Column>
				<h3>Created at {moment(new Date(roomData.createdAt)).format("LLL")}</h3>
			</Column>
		</Row>

		<Row>
			<a href={`/users/${ownerUsername}`}>
				Owner: {ownerUsername}
			</a>
		</Row>

		messages:

		{#each messages as message}
			<code>{JSON.stringify(message)}</code>
		{/each}
	</Grid>
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

