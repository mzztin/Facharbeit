<script lang="ts">
	import axios from "axios";
	import { Button,PasswordInput,TextInput } from "carbon-components-svelte";
	import { } from "svelte";

	let username: string;
	let password: string;
	let data: any;

	let signedUp = false;

	const login = async () => {
		if (!username || !password) {
			alert("You have to give both username and password!");
			username = null;
			password = null;
			return;
		}

		try {
			const res = await axios.post("http://localhost:4000/users/signup", {
				username,
				password
			});

			if (await res.data) {
				signedUp = true;
			}
		} catch (e) {
			console.debug(e)
		}
		
	};
</script>

<p>{$data}</p>

<h2>Register</h2>
<br />

{#if signedUp}
	<h4>Signed In</h4>
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

	<Button class="space-y-3" on:click={login} kind="tertiary">Register</Button>
{/if}

