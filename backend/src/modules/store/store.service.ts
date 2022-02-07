import { Injectable } from "@nestjs/common";

@Injectable()
export class StoreService {
	private sessionStore: Map<string, number | undefined> = new Map();

	public addSession(sessionId: string, userId: number): void {
		this.dump();

		this.sessionStore.set(sessionId, userId);
	}

	public getUserID(sessionId: string) {
		return this.sessionStore.get(sessionId);
	}

	public removeSession(sessionId: string): void {
		this.sessionStore.set(sessionId, undefined);
	}

	public dump() {
		console.log(this.sessionStore.values());
	}
}
