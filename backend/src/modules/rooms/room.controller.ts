import { Controller, Get, Post, Session, UnauthorizedException } from "@nestjs/common";
import { MySession } from "../../context";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
export class RoomController {
	public constructor(private roomsService: RoomsService) {}

	@Get()
	async myRooms(@Session() session: MySession) {
		const userId = session.userId;

		if (!userId) {
			throw new UnauthorizedException("Not logged in");
		}

		return this.roomsService.getOwnRooms(userId);
	}

	@Post()
	async create(@Session() session: MySession) {
		session.userId;
	}
}
