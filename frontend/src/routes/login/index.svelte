<script lang="ts">
	import { Getter } from "$lib/utils/store";
	import axios from "axios";
	import { Button,PasswordInput,TextInput } from "carbon-components-svelte";
	import { re } from "svelte/internal";

	let username: string;
	let password: string;

	let success = null;
	let error = null;

	const loggedIn = Getter.getLoggedIn()
	const un = Getter.getUsername()

	async function handleLogin() {
		if (!username || !password) {
			alert("You have to give both username and password!");
			return;
		}

		try {
			const res = await axios.post("http://localhost:4000/users/login", {
				username,
				password
			});

			console.log("status", res.status);
			console.log("data", await res.data);

			if (res.status === 201) {
				success = true;
				return;
			}

			if (res.status === 400 || res.status === 401) {
				success = false;
				error = true;
			}

			console.log({ error, success });
		} catch (e) {
			error = true;
			console.log({ e });
		}
	}
</script>

<h1>Login</h1>
<p>Dev: {loggedIn}, Username: {un}</p>

<br />

{#if success}
	<h2>Logged in</h2>

	<a href="/" >
        <h4>Return to homepage</h4>
    </a>
{:else}
	<TextInput
		bind:value={username}
		labelText="Username"
		placeholder="Enter username"
		min={2}
		max={16}
	/>
	<PasswordInput bind:value={password} labelText="Password" placeholder="Enter password" />

	<br />

	{#if error}
		<h4>Could not login</h4>

		<br />
	{/if}

	<Button class="space-y-3" on:click={handleLogin} kind="tertiary">Login</Button>
{/if}
