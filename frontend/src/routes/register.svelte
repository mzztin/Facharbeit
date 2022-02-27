<script lang="ts">
	import { goto } from "$app/navigation";
	import axios from "axios";
	import { Button, PasswordInput, TextInput } from "carbon-components-svelte";

	let username: string;
	let password: string;

	let signedUp = false;

	const login = async () => {
		if (!username || !password) {
			alert("You have to give both username and password!");
			username = null;
			password = null;
			return;
		}

		try {
			const res = await axios.post("/users/signup", {
				username,
				password
			});

			if (await res.data) {
				signedUp = true;
				goto("/");
				setTimeout(() => {
					location.reload();
				}, 100);
			}
		} catch (e) {
			console.debug(e);
		}
	};
</script>

<h2>Register</h2>
<br />

{#if signedUp}
	<h4>Signed In</h4>

	<a class="hover-href" href="/">
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

	<Button class="space-y-3" on:click={login} kind="tertiary">Register</Button>
{/if}
