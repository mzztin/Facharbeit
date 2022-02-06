<script lang="ts">
	import { Grid,Row } from "carbon-components-svelte";

	export let id: number;
	export let avatar: string;
	export let username: string;
	export let content: string;
	export let createdAt: Date;
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
</style>
