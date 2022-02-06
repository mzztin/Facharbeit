import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Session,
	UnauthorizedException
} from "@nestjs/common";
import { MySession } from "../../context";
import { CreateRoomDTO } from "./dto/CreateRoomDTO";
import RoomEntity from "./room.entity";
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
		const room = await RoomEntity.findOne({
			where: {
				code
			}
		});

		if (!room) {
			throw new BadRequestException("Room with id not found");
		}

		return room.messages;
	}

	@Get(":code")
	async getRoom(@Param("code") code: string) {
		const room = await RoomEntity.findOne({
			where: {
				code
			}
		});

		if (!room) throw new NotFoundException("room not found");

		const { messages, ...result } = room;
		return result;
	}

	@Post()
	async create(@Session() session: MySession, @Body() body: CreateRoomDTO) {
		if (!session.userId) {
			throw new UnauthorizedException();
		}

		const room = new RoomEntity();

		room.ownerId = session.userId;
		room.name = body.name;
		room.messages = [];
		room.createdAt = new Date();
		await room.genCodeAndSave();

		const { messages, ...result } = room;

		return result;
	}
}
