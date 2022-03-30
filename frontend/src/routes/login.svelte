<script lang="ts">
	import { goto } from "$app/navigation";
	import axios from "axios";
	import { Button, PasswordInput, TextInput } from "carbon-components-svelte";

	let username: string;
	let password: string;

	let success = null;
	let error = null;

	async function handleLogin() {
		if (!username || !password) {
			alert("You have to give both username and password!");
			return;
		}

		try {
			const res = await axios.post("/users/login", {
				username,
				password
			});

			if (res.status === 201) {
				success = true;
				goto("/");
				setTimeout(() => {
					location.reload();
				}, 100);
				return;
			}

			if (res.status === 400 || res.status === 401) {
				success = false;
				error = true;
			}
		} catch (e) {
			error = true;
		}
	}
</script>

<h1>Login</h1>

<br />

{#if success}
	<h2>Logged in</h2>

	<a href="/">
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
