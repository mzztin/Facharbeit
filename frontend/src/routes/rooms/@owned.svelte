<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import axios from "axios";
    import moment from "moment";


    export const load: Load = async () => {
        
        try {
            const res = await axios.get("/rooms");
            const rooms = res.data;
            
            return {
                props: {
                    loading: false,
                    rooms
                }
            }
        } catch (e) {
            
            return {
                props: {
                    loading: false,
                    error: true
                }
            }
        }

    }
    
</script>

<script lang="ts">
    export let loading = true;
    export let error = false;
    export let rooms: Array<{
        code: string,
        createdAt: string,
        id: number,
        name: string,
        ownerId: number
    }>;
</script>

{#if loading}
    <h2>Loading...</h2>
{:else if error}
    <h2>Error</h2>
    <h3>Possibly not logged in</h3>
{:else}
    <h2>My rooms</h2>
    <br />
    
    {#each rooms as room}
        <h4>Room: <i>{room.name.length > 0 ? room.name : "No Name"}</i> (ID: {room.id})</h4>
        <h5>Code: <b>{room.code}</b></h5>
        <h6>Created at: {moment(new Date(room.createdAt)).format("LLL")}</h6>
        <br />
        <br />
    {/each}
{/if}