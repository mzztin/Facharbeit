<script lang="ts">
	import { Row, Column, Grid } from "carbon-components-svelte";
	import moment from "moment";

	export let username: string;
	export let avatar: string;
	export let content: string;
	export let createdAt: Date;
	export let id: string = "martin_xd";

	const beautify = () => {
		return moment(createdAt).fromNow();
	};

	import {} from "carbon-components-svelte";
</script>

<Grid narrow padding>
	<Row>
		<a href={`/users/${id}/`}>
			<img src={avatar} alt="https://avatars.dicebear.com/api/big-ears-neutral/static.svg" />
			<p>{username}</p>
		</a>
	</Row>

	<Row class="text">
		{content}
	</Row>
</Grid>

<style>
	img {
		border-radius: 50%;
		height: 18px;
		width: 18px;
	}

	.username {
	}

	.text {
		margin-left: 12px;
		max-width: 70%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
</style>
