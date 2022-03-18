<script lang="ts" context="module">
    import { goto } from "$app/navigation";
    import type { User } from "$lib/types/user";
    import { Getter } from "$lib/utils/store";
    import type { Load } from "@sveltejs/kit";
    import axios from "axios";
    import moment from "moment";

	export const load: Load = async ({ page }) => {
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
            goto("/users/not_found")
		}
	};
</script>

<script lang="ts">
	export let user: User;

	const isMe = user.username == Getter.getUsername();
    const infoText = isMe ? "(you)" : ""
</script>


<main>
    <h3>User Profile</h3>


    <div class="username">
        <img src={user.avatar} alt="nf" />
        <h4>Username: {user.username} {infoText}</h4>
    </div>
    
    
    <h5>Joined at: {moment(new Date(user.createdAt)).format("LLL")}</h5>
    
    <h6>ID: {user.id}</h6>
</main>

<style>
    main {
        gap: 12px;
    }
    
    .username {
        display: flex;
        flex-direction: row;
    }


    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
</style>