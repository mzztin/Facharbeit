<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	import { Column,Grid,Row } from "carbon-components-svelte";
	import moment from "moment";


	export const load: Load = async ({ page, fetch }) => {
		const userId = page.params.userId;
		try {
			const res = await axios.get(`/users/${userId}`);
			const data = res.data;
			
			console.debug({ data })

			return {
				props: {
					exists: true,
					data
				}
			}
		} catch (e) {
			return {
				props: {
					exists: false
				}
			}	
		}
	};
</script>

<script lang="ts">
	export let exists: boolean = undefined;
	export let data: {
		createdAt: string,
		id: number,
		username: string
	} = undefined;
</script>

{#if exists}
	<h3>User Profile</h3>

	<Grid narrow padding>
		<Row>
			<Column>
				<h5>Username: {data.username}</h5>
			</Column>

			<Column>
				<h7>ID: {data.id}</h7>
			</Column>
		</Row>

		<Row>
			<Column>
				<h5>Created at: {moment(new Date(data.createdAt)).format("LLL")}</h5>
			</Column>
		</Row>
	</Grid>

{:else}
	<h3>User does not exist!</h3>
{/if}