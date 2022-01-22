import { get, writable } from "svelte/store";

let username = writable(undefined);
let sessionId = writable(undefined);
let loggedIn = writable(false);

export class Getter {
    static getUsername() {
        return get(username)
    }

    static getSessionID() {
        return get(sessionId);
    }

    static getLoggedIn() {
        return get(loggedIn);
    }
}

export default {
    username,
    sessionId,
    loggedIn,
}