<script lang="ts">
import { goto } from "$app/navigation";
import { Button,Search } from "carbon-components-svelte";


let value: string;

</script>

<Search bind:value placeholder="Enter username" />
<br />
<Button size="small" on:click={() => {
    goto(`/users/${value}`)
}}>Go to profile</Button>

<br />
<br />

<h3>OR</h3>

<br />

<Button size="small" on:click={() => {
    goto(`/users/@me`)
}}>Go to my profile</Button>