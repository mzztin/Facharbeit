import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	getMain() {
		return "Chat Application API";
	}
}
