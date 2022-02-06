<script context="module" lang="ts">
import type { Load } from "@sveltejs/kit";
import axios from "axios";

	let success = false;
	let awaiting = true;

	export const load: Load = async ({ page }) => {
		try {
			await axios.post("/users/logout");

			return {
				redirect: "/"
			}
		} catch (e) {
			return {
				redirect: "/"
			}
		}
	}
</script>
