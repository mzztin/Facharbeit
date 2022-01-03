import { Injectable } from "@nestjs/common";
import RoomEntity from "./room.entity";

@Injectable()
export class RoomsService {
	async getOwnRooms(userId: number): Promise<RoomEntity[]> {
		return await RoomEntity.find({
			where: {
				ownerId: userId
			}
		});
	}

	async createRoom(ownerId: number) {
		let room = new RoomEntity();
		room.ownerId = ownerId;
		room.messages = [];
		room.createdAt = new Date();

		return await room.genCodeAndSave();
	}

	async isValidCode(code: string) {
		return (await (RoomEntity.find({ where: { code: code }}))).length !== 0;
	}
}
