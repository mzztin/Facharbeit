import { BadRequestException, Controller, Get, Param, Post, Session, UnauthorizedException } from "@nestjs/common";
import { MySession } from "../../context";
import RoomEntity from "./room.entity";
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

	@Get(":id/messages")
	async getMessages(@Param(":id") id: number) {
		const room = await RoomEntity.findOne(id);
		if (!room) {
			throw new BadRequestException("Room with id not found");
		}

		return room.messages;
	}

	@Post()
	async create(@Session() session: MySession) {
		session.userId;
	}
}
