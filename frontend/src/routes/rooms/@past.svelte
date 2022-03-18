<script lang="ts">
	import RoomDescription from "$lib/components/RoomDescription.svelte";
	import type { Room } from "$lib/types/rooms";
	import axios,{ AxiosResponse } from "axios";
	import moment from "moment";

	type RoomAddon = Room & {
		lastActivity: string;
	};

	const convertToArray = (res: AxiosResponse) => {
		return res.data as RoomAddon[];
	};
</script>

{#await axios.get("/users/joinedRoom/list")}
	Loading
{:then val}
	{#if val.data.length == 0}
		<h4>Nothing found!</h4>
	{:else}
		{#each convertToArray(val) as room}
			<RoomDescription {room}>
				<h6>Last time joined: {moment(new Date(room.lastActivity)).format("LLL")}</h6>
			</RoomDescription>
		{/each}
	{/if}
{:catch e}
	{e}
{/await}
