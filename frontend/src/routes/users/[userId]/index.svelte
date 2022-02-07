<script lang="ts" context="module">
	import type { User } from "$lib/types/user";
	import { Getter } from "$lib/utils/store";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Column,Grid,Row } from "carbon-components-svelte";
	import moment from "moment";

	export const load: Load = async ({ page, fetch }) => {
		const userId = page.params.userId;
		try {
			const res = await axios.get(`/users/${userId}`);
			const data = res.data;

			return {
				props: {
					exists: true,
					user: data as User
				}
			};
		} catch (e) {
			return {
				props: {
					exists: false
				}
			};
		}
	};
</script>

<script lang="ts">
	export let exists: boolean = undefined;
	export let user: User;

    const isMe = user.username == Getter.getUsername();
</script>

{#if exists}
	<h3>User Profile</h3>

    {#if isMe}
        <h5>This is you!</h5>
    {:else}
        <h5>This is not you!</h5>
    {/if}
    
	<Grid narrow padding>
		<Row>
			<Column>
				<h5>Username: {user.username}</h5>
			</Column>

			<Column>
				<h7>ID: {user.id}</h7>
			</Column>
		</Row>

		<Row>
			<Column>
				<h5>Created at: {moment(new Date(user.createdAt)).format("LLL")}</h5>
			</Column>
		</Row>
	</Grid>
{:else}
	<h3>User does not exist!</h3>
{/if}
