<script lang="ts">
	import { Button,TextInput } from "carbon-components-svelte";
	let code: string = "";
</script>

<h2>Rooms</h2>
<h4>If you want to join a room enter the code here</h4>
<br class="split" />
<TextInput labelText="Code" placeholder="12345" helperText="This is a randomly generated code you will recieve when creating a room" bind:value={code}/>
<br />
<Button size="small" href="/rooms/{code}">Join</Button>
<br class="split" />
<h2>OR</h2>
<br />
<Button href="/rooms/create" size="small">Create room</Button>
<br class="split" />
<h2>OR</h2>
<br />
<Button href="/rooms/@owned" size="small">My rooms</Button>
<br class="split" />
<h2>OR</h2>
<br />
<Button href="/rooms/@past" size="small">Past rooms</Button>

<style>
	.split { line-height: 30px; }
</style>