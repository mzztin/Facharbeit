<script lang="ts" context="module">
	import type { Message,Room } from "$lib/types/rooms";
	import api from "$lib/utils/cached-api";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Column,Grid,Row,TextInput } from "carbon-components-svelte";
	import moment from "moment";
	import { io,Socket } from "socket.io-client";
	import { onMount } from "svelte";

	export const load: Load = async ({ page }) => {
		const roomId = page.params.roomId;
		const roomData = await axios.get(`/rooms/${roomId}`);

		if (roomData.status >= 400) {
			return {
				props: {
					isValid: false
				}
			}
		}

		return {
			props: {
				roomData: roomData.data,
				isValid: true
			}
		};
	};
</script>

<script lang="ts">

	const fetchMessages = async () => {
		return (await axios.get(`/rooms/${roomData.code}/messages`)).data as Message[];
	};

	export let roomData: Room;
	export let isValid: boolean = undefined;


	const socketURL = `ws://${"192.168.1.53"}:4001`;
	let socket: Socket;

	let messages: Message[] = [];
	let ownerUsername: string | undefined;

	if (isValid) {	
		onMount(async () => {
			const owner = await axios.get(`/users/${roomData.ownerId}}`);
			ownerUsername = owner.data.username;

			messages = await fetchMessages();

			socket = io(socketURL + `?sessionId=${Getter.getSessionID()}&roomId=${roomData.code}`);

			socket.emit("joinRoom", roomData.code);

			socket.on("userJoined", async (payload) => {
				console.log(payload);
			});

			socket.on("recieveMessage", async (payload) => {
				addMessage(payload as Message);
			});
		});
	}

	let value: string = "";

	const addMessage = (data: Message) => {
		messages.push(data);

		// reassign => https://stackoverflow.com/questions/70099100/how-would-i-make-an-each-loop-in-svelte-reactive
		messages = messages;
	};

	const submit = async () => {
		if (value == "" || value == undefined) {
			value = "";
			return;
		}

		socket.emit("sendMessage", value)
		
		value = "";
	}

	const getUserData = async (id: number) => {
		const data = (await api.get(`/users/${id}`)).data;
		console.log("userData", data);
		return data;
	}
	getUserData(3)
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

		<TextInput placeholder="Enter message" on:keydown={(event) => {
			if (event.code == "Enter") submit();
		}} bind:value/>
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
