<script lang="ts">
import axios from "axios";
import { Button,TextInput } from "carbon-components-svelte";

    let created: boolean = false;
    let code: string | undefined = undefined;
    let loading = false;
    let error = false;

    let name: string = "";

    const submit = async () => {
        loading = true;

        try {
            const res = await axios.post("/rooms", {
                name
            })

            code = res.data.code;
            created = true;
        } catch (e) {
            error = true;
        }

        loading = false;
    }
</script>

<h1>Create a chatroom</h1>

<br />

{#if created}
    <h2>Successfully created a chatroom</h2>

    <h5>Chatroom Code: {code ?? "N.A."}</h5>
{:else if loading}
    <h2>Creating room...</h2>
{:else if error}
    <h2>Could not create a room</h2>
    <h4>Request errored - Possibly not logged in!</h4>
{:else}
    <TextInput labelText="Enter room name" placeholder="My private room" bind:name/>

    <br />

    <Button kind="secondary" on:click={submit}>Submit</Button>
{/if}