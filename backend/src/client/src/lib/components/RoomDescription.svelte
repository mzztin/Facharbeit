<script lang="ts">
	import type { Room } from "$lib/types/rooms";
	import { Button } from "carbon-components-svelte";
	import moment from "moment";

	export let room: Room;
</script>

<h4>Room: <i>{room.name.length > 0 ? room.name : "No Name"}</i> (ID: {room.id})</h4>
<h5>Code: <b>{room.code}</b></h5>
<h6>Created at: {moment(new Date(room.createdAt)).format("LLL")}</h6>
<slot />
<br />
<Button size="small" href={`/rooms/${room.code}`}>Join room</Button>
<br />
<br />
