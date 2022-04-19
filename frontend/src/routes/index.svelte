<script lang="ts">
	import { Getter } from "$lib/utils/store";

	const username = Getter.getUsername();
</script>

{#if username}
	<h1>Welcome, {username}</h1>
{:else}
	<h1>Welcome</h1>
	<h4>You are not logged in!</h4>
{/if}
