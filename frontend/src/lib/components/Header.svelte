<script lang="ts">
	import { Getter } from "$lib/utils/store";
	import { Header,HeaderAction,HeaderNav,HeaderNavItem,HeaderPanelDivider,HeaderPanelLink,HeaderPanelLinks,HeaderUtilities } from "carbon-components-svelte";
	import { expoIn } from "svelte/easing";

	let isOpen = false;

	let username = Getter.getUsername();
	let isLoggedIn = Getter.getLoggedIn() ?? false;

	const headerTransition = {
		duration: 750, delay: 100, easing: expoIn
	}
</script>

<Header company="Chat" platformName="Application">
	{#if isLoggedIn}
		<HeaderNav>
			<HeaderNavItem href="/rooms" text="Rooms" />
		</HeaderNav>
	{/if}
	  
	<HeaderUtilities>
		<HeaderAction bind:isOpen transition={headerTransition}>
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