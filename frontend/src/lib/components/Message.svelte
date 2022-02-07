<script lang="ts">
		import type { MessageWithUser } from "$lib/types/rooms";
		import type { User } from "$lib/types/user";
		import moment from "moment";


	
	export let message: MessageWithUser;
	let user: User = message.user;
</script>



<p>{user.username} said: {message.content} (At: {moment(new Date(message.createdAt)).format("LLL")})</p>

<style>
	img {
		border-radius: 50%;
		height: 18px;
		width: 18px;
	}
</style>
