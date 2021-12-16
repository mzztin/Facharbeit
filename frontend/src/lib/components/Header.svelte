<script lang="ts">
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink
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
					<HeaderPanelLink>My account</HeaderPanelLink>
					<HeaderPanelLink>Sign-Out</HeaderPanelLink>
				{:else}
					<HeaderPanelDivider>My account</HeaderPanelDivider>
					<HeaderPanelLink>Login</HeaderPanelLink>
					<HeaderPanelLink>Sign-Up</HeaderPanelLink>
				{/if}
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
