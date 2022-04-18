<script context="module" lang="ts">
	import { goto } from "$app/navigation";
	import type { Load } from "@sveltejs/kit";
	import axios from "axios";
	export const load: Load = async ({ page }) => {
		try {
			await axios.post("/users/logout");
			goto("/");
			setTimeout(() => { location.reload(); }, 100);
		} catch (e) {
			goto("/");
			setTimeout(() => { location.reload(); }, 100);
		}
	};
</script>
