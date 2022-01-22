<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    let success = false;
    let awaiting = true;

    onMount(async () => {
        const res = await axios.post("http://localhost:4000/users/logout")
        if (res.data) {
            success = true;
        } else {
            awaiting = false;
        }
    })
</script>

{#if {success}}
    <h2>Successfully logged out</h2>
    
    <a href="/">
        <h4>Return to homepage</h4>
    </a>
{:else if {awaiting}}
    <h2>Waiting to log out...</h2>
{:else}
    <h2>Could not log out</h2>
{/if}