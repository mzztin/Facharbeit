<script lang="ts">
    import { Button, TextInput } from "carbon-components-svelte";


    let code: string = "";

</script>

<h2>Rooms</h2>
<h4>If you want to join a room enter the code here</h4>

<br />
<br />
 
<TextInput labelText="Code" placeholder="12345" helperText="This is a randomly generated code you will recieve when creating a room">Code</TextInput>

<br />

<h2>OR</h2>
<br />

<Button label="Create room" href="/rooms/create">Create room</Button>