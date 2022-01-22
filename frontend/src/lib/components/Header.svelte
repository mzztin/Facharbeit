<script lang="ts">
	import {
	Header,HeaderAction,HeaderPanelDivider,
	HeaderPanelLink,HeaderPanelLinks,HeaderUtilities
	} from "carbon-components-svelte";

	let isOpen = false;

	export let username = undefined;
	export let isLoggedIn: boolean = false;

	console.log(username);
</script>

<Header company="Chat" platformName="Application">
	<HeaderUtilities>
		<HeaderAction bind:isOpen>
			<HeaderPanelLinks>
				{#if isLoggedIn}
					<HeaderPanelDivider>My account</HeaderPanelDivider>
					<HeaderPanelLink href="/users/@me">My account</HeaderPanelLink>
					<HeaderPanelLink href="/logout">Logout</HeaderPanelLink>
				{:else}
					<HeaderPanelDivider>My account</HeaderPanelDivider>
					<HeaderPanelLink href="/login">Login</HeaderPanelLink>
					<HeaderPanelLink href="/register">Sign-Up</HeaderPanelLink>
				{/if}
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
