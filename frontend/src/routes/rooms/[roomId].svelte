<script lang="ts" context="module">
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Column, Grid, Row } from "carbon-components-svelte";
	import { io, Socket } from "socket.io-client";
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
	export let roomId: string = "";

	export let roomInfo: {
		id: number;
		name: string;
		ownerId: number;
		createdAt: Date;
		code: string;
	} = undefined;

	export let isValid: boolean = undefined;

	let ownerUsername: string;

	let messages: Array<{
		content: string;
		[value: string]: any;
	}> = [];

	const socketURL = `ws://${"192.168.1.53"}:4001`;

	const fetchMessages = async () => {
		console.log({ roomId });
		return (await axios.get(`/rooms/${roomId}/messages`)).data as Array<{
			content: string;
			[value: string]: any;
		}>;
	};

	let socket: Socket;

	if (isValid) {
		onMount(async () => {
			const owner = await axios.get(`/users/${roomInfo.ownerId}}`);
			ownerUsername = owner.data.username;

			socket = io(socketURL + `?sessionId=${Getter.getSessionID()}&roomId=${roomId}`);

			socket.emit("joinRoom", roomId);

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

	const sendMessage = () => {
		messages.push({
			content: "hello"
		});
	};

	setInterval(sendMessage, 2000);
</script>

{#if isValid}
	<Grid>
		<Row>
			<Column>
				<h1>Chatroom - {roomInfo.name}</h1>
			</Column>

			<Column>
				<h3>ID: {roomInfo.code}</h3>
			</Column>

			<Column>
				<h3>Created at {roomInfo.createdAt}</h3>
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
	<h3>Room with code <b>{roomId}</b> not found!</h3>
	<br />

	<h3>Click one of these links to return:</h3>
	<br />

	<a href="/"><h4>Return to homepage</h4></a>
	<br />

	<h5>OR</h5>

	<br />
	<a href="/rooms"><h4>Return to room hub</h4></a>
{/if}

<style>
	a {
		text-decoration: none;
		color: inherit;
	}

	a:hover {
		text-decoration: underline;
		color: crimson;
	}
</style>
