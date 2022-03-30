<script lang="ts">
	import RoomDescription from "$lib/components/RoomDescription.svelte";
	import type { Room } from "$lib/types/rooms";
	import axios, { AxiosResponse } from "axios";

	const convertToArray = (res: AxiosResponse) => {
		return res.data as Room[];
	};
</script>

{#await axios.get("/rooms")}
	Loading
{:then val}
	{#if val.data.length == 0}
		<h4>Nothing found!</h4>
	{:else}
		{#each convertToArray(val) as room}
			<RoomDescription {room} />
		{/each}
	{/if}
{:catch e}
	{e}
{/await}
