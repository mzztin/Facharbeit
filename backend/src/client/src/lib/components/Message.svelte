<script lang="ts">
	import type { Message } from "$lib/types/rooms";
	import type { User } from "$lib/types/user";
	import moment from "moment";
	export let message: Message;
	export let sender: User;
	const createdAt = new Date(message.createdAt);

	const isToday = () => {
		const now = new Date();
		if (now.getDate() == createdAt.getDate() && now.getMonth() == createdAt.getMonth() && now.getFullYear() == createdAt.getFullYear()) { return true;
		} else { return false; }
	};

	const isYesterday = () => {
		const now = new Date();
		if (now.getDate() == createdAt.getDate() - 1 && now.getMonth() == createdAt.getMonth() && now.getFullYear() == createdAt.getFullYear()) { return true;
		} else { return false; }
	};
</script>

<div class="message">
	<img src={sender.avatar} alt="https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-11.jpg" />
	<div class="top">
		<a href={`/users/${sender.username}`}><p class="username">{sender.username}</p></a>
		{#if isToday()} <p class="time">Today at {moment(new Date(message.createdAt)).format("hh:mm a")}</p>
		{:else if isYesterday()} <p class="time">Yesterday at {moment(new Date(message.createdAt)).format("hh:mm a")}</p>
		{:else} <p class="time">{moment(new Date(message.createdAt)).format("MM/DD/YYYY")}</p>
		{/if}
	</div>
	
	<p class="content">{message.content}</p>
</div>

<style>
	.message {
		display: flex;
		flex-direction: column;
		font-size: 0.9em;
		margin: 1em 0;
		padding: 0.25em 1em 0;
	}

	.message:hover {
		background-color: #44464b;
	}

	.message a {
		color: #0096cf;
		font-weight: normal;
		text-decoration: none;
	}

	.message a:hover {
		font-weight: normal;
		text-decoration: underline;
	}

	.time {
		color: #72767d;
		font-size: 12px;
		margin-left: 3px;
	}

	.top {
		display: flex;
		flex-direction: row;
	}

	img {
		border-radius: 50%;
		height: 32px;
		width: 32px;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		column-gap: 10px;
	}
</style>
