import { Injectable } from "@nestjs/common";
import { AES, enc, SHA256 } from "crypto-js";
import { ConfigService } from "../config/config.service";

@Injectable()
export class HashService {
	constructor(private config: ConfigService) {}

	hashPassword(password: string): string {
		return (SHA256(this.getSalt() + password + "string") + "").toString();
	}

	matches(hash: string, haystack: string): boolean {
		return hash === this.hashPassword(haystack);
	}

	encryptSessionId(sessionId: string) {
		return AES.encrypt(sessionId, this.getSessionKey()).toString();
	}

	decryptSessionId(encrypted: string) {
		return AES.decrypt(encrypted, this.getSessionKey()).toString(enc.Utf8);
	}

	private getSessionKey() {
		return this.config.get("SESSION_STORE_SECRET") ?? "not found";
	}

	private getSalt() {
		return this.config.get("SALT") ?? "not found";
	}
}
