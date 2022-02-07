<script lang="ts" context="module">
	import type { Message } from "$lib/types/rooms";
	import type { User } from "$lib/types/user";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { TextInput } from "carbon-components-svelte";
	import type { Socket } from "socket.io-client";
	import { io } from "socket.io-client";
	import { onMount } from "svelte";

	export const load: Load = async ({ page, fetch }) => {
		const userId = page.params.userId;
		try {
			const res = await axios.get(`/users/${userId}`);
			const data = res.data;

			return {
				props: {
					exists: true,
					user: data as User
				}
			};
		} catch (e) {
			return {
				props: {
					exists: false
				}
			};
		}
	};
</script>

<script lang="ts">




    	export let exists: boolean = undefined;

        export let user: User;

        let value: string = "";

        let messages: Array<any> = [];

    let socket: Socket;


        if (exists) {
            onMount(async () => {
                messages = await fetchMessages();
    
                socket = io(`http://192.168.1.53:4001`, {
                    reconnection: true,
                    query: {
                        sessionId: Getter.getSessionID(),
                        targetId: user.id
                    }
			    });

                socket.on("recieveMessage", payload => {
                    addMessage(payload as any);
                })
            });
        }

    const fetchMessages = async () => {
        const res = await axios.get(`/direct/${user.id}`);
        return res.data;
    }

    const addMessage = async (message: Message) => {
        messages.push(message);

        messages = messages;
    }

    const submit = async () => {
		if (value == "" || value == undefined) {
			value = "";
			return;
		}

        socket.emit("sendMessage", value);
    
        value = "";
    }
</script>


{#each messages as message}
    <code>{JSON.stringify(message)}</code>
    <br />    
{/each}

<TextInput placeholder="Enter message" on:keydown={(event) => {
    if (event.code == "Enter") submit();
}} bind:value/>