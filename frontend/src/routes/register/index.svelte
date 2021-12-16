<script lang="ts">
	import { TextInput, PasswordInput, Button } from "carbon-components-svelte";
	import axios from "axios";

	let username: string;
	let password: string;
	let data: any;

	const login = async () => {
		if (!username || !password) {
			alert("You have to give both username and password!");
			username = null;
			password = null;
			return;
		}

		const res = await axios.post("http://localhost:4000/users/signup", {
			username,
			password
		});

		data = await res.data;

		alert(data);
	};

	$: data;
</script>

<p>{$data}</p>

<h2>Register</h2>
<br />

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
