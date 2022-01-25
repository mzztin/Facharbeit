<script lang="ts">
	import { Getter } from "$lib/utils/store";
	import { Header,HeaderAction,HeaderPanelDivider,HeaderPanelLink,HeaderPanelLinks,HeaderUtilities } from "carbon-components-svelte";

	let isOpen = false;

	let username = Getter.getUsername();
	let isLoggedIn = Getter.getLoggedIn() ?? false;
</script>

<Header company="Chat" platformName="Application">
	<HeaderUtilities>
		<HeaderAction bind:isOpen>
			<HeaderPanelLinks>
				{#if isLoggedIn}
					<HeaderPanelDivider>My account - {username}</HeaderPanelDivider>
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
