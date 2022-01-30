import { Injectable } from "@nestjs/common";

type SessionIdToUserId = {
	[sessionId: string]: number;
};

@Injectable()
export class StoreService {
	private sessionIdToUserId: SessionIdToUserId = {};

	public addSession(sessionId: string, userId: number): void {
		if (this.sessionIdToUserId[sessionId]) {
			return;
		}

		this.sessionIdToUserId[sessionId] = userId;

		console.log(`Added ${sessionId}, uid: ${userId}`);

		this.dump();
	}

	public getUserID(sessionId: string) {
		return this.sessionIdToUserId[sessionId];
	}

	public removeSession(sessionId: string): void {
		if (this.sessionIdToUserId[sessionId]) {
			delete this.sessionIdToUserId[sessionId];
		}
	}

	public dump() {
		console.log(this.sessionIdToUserId);
	}
}
