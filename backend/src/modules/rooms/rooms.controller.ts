import { Body, Controller, Get, Param, Post, Session, UnauthorizedException } from "@nestjs/common";
import { MySession } from "../../context";
import { CreateRoomDTO } from "./dto/createroom.dto";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
export class RoomController {
	public constructor(private roomsService: RoomsService) {}

	@Get()
	async myRooms(@Session() session: MySession) {
		const userId = session.userId;

		if (!userId) {
			throw new UnauthorizedException();
		}

		return this.roomsService.getOwnRooms(userId);
	}

	@Get(":code/messages")
	async getMessages(@Param("code") code: string) {
		return this.roomsService.sortMessages(await this.roomsService.getMessages(code));
	}

	@Get(":code")
	async getRoom(@Param("code") code: string) {
		return this.roomsService.getRoomDataByCode(code);
	}

	@Post()
	async create(@Session() session: MySession, @Body() body: CreateRoomDTO) {
		if (!session.userId) {
			throw new UnauthorizedException();
		}

		return await this.roomsService.createRoom(body.name, session.userId);
	}
}
