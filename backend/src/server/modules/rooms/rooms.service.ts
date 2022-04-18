import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Socket } from "socket.io";
import RoomEntity from "./room.entity";
import RoomMessageEntity from "./room.message.entity";

@Injectable()
export class RoomsService {
	async getOwnRooms(userId: number): Promise<RoomEntity[]> {
		return await RoomEntity.find({ where: { ownerId: userId } });
	}

	async createRoom(name: string, ownerId: number) {
		const room = new RoomEntity();
		room.name = name;
		room.ownerId = ownerId;
		room.messages = [];
		room.createdAt = new Date();
		return await room.generateCodeAndSave();
	}

	async isValidCode(code: string) {
		return (await RoomEntity.find({ where: { code: code } })).length !== 0;
	}

	async disconnect(client: Socket) {
		client.disconnect(true);
	}

	sortMessages(messages: RoomMessageEntity[]) {
		return messages.sort((a, b) => b.id - a.id);
	}

	async createMessage(senderId: number, messageValue: string, roomCode: string) {
		let message = new RoomMessageEntity();
		message.senderId = senderId;
		message.content = messageValue;
		message.createdAt = new Date();
		await message.save();

		let room = await RoomEntity.findOne({ where: { code: roomCode }});

		if (!room) {
			Logger.error(`Room with code ${roomCode} not found`);
			return;
		}

		if (!room.messages) room.messages = [];

		room.messages.push(message);
		await room.save();

		return message;
	}

	async reloadSocketUser(client: Socket) {
		client.emit("reload_page");
	}

	async getMessages(code: string) {
		const room = await RoomEntity.findOne({
			where: {
				code
			}
		});
		if (!room) {
			throw new BadRequestException("Room with id not found");
		}
		if (!room.messages) {
			room.messages = [];
			await room.save();
		}
		return room.messages;
	}

	async getRoomDataByCode(code: string) {
		const room = await RoomEntity.findOne({ where: { code } });
		if (!room) throw new NotFoundException("room not found");

		const { messages, ...result } = room;
		return result;
	}
}
