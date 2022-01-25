import { Injectable } from "@nestjs/common";
import { AES, enc, SHA256 } from "crypto-js";
const { Utf8 } = enc;

const SESSION_ID_KEY = "MY_KEY";

@Injectable()
export class HashService {
	hashPassword(password: string): string {
		return (
			SHA256(
				"53d0af5d1ccc03eab9088c234bb46a46deaa9e17682416d459beb49fc78802a1" +
					password +
					"string"
			) + ""
		).toString();
	}

	matches(hash: string, haystack: string): boolean {
		return hash === this.hashPassword(haystack);
	}

	encryptSessionId(sessionId: string) {
		return AES.encrypt(sessionId, SESSION_ID_KEY).toString();
	}

	decryptSessionId(encrypted: string) {
		return AES.decrypt(encrypted, SESSION_ID_KEY).toString(Utf8);
	}
}
