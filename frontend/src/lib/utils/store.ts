import { get, writable } from "svelte/store";

type Either<T> = unknown | undefined | T;

let sessionId = writable();
let loggedIn = writable(undefined);
let username = writable();


export class Getter {
	static getUsername(): Either<string> {
		if (get(username) == undefined) {
			return undefined;
		}

		return get(username);
	}

	static getSessionID(): Either<string> {
		if (get(sessionId) == undefined) {
			return undefined;
		}

		return get(sessionId);
	}

	static getLoggedIn(_default: boolean = false): boolean {
		if (get(loggedIn) == undefined) {
			return _default;
		}

		return get(loggedIn);
	}
}

export default {
	username,
	sessionId,
	loggedIn
};
