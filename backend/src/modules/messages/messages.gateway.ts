/**
 * 
 * Socket und Session verbindung https://github.com/nestjs/nest/issues/445
 * 
 */

import { BadRequestException, Session } from "@nestjs/common";
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	MessageBody
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MySession } from "../../context";
import MessageDTO from "./dto/message.dto";
import { EnterRoomDTO } from "./dto/room.dto";
import { RoomsService } from '../rooms/rooms.service';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	public constructor(private roomsService: RoomsService) {}

	handleConnection(client: Socket, ...args: any[]) {
		console.debug(`Client ${client.id} connected`);
	}

	handleDisconnect(client: Socket) {
		console.debug(`Client ${client.id} disconnected`);
	}

	@SubscribeMessage("sendMessage")
	sendMessage(client: Socket, @MessageBody() data: MessageDTO) {
		// check here

		this.server.emit("recieveMessage", data);
	}

	@SubscribeMessage("joinRoom")
	enterRoom(client: Socket, @MessageBody() { code }: EnterRoomDTO, @Session() session: MySession) {
		console.log({ session });
	
		if (!this.roomsService.isValidCode(code)) {
			throw new BadRequestException("Room with given code not found");
		}


		client.join(code)

		this.server.emit("userJoinedRoom", {

		})
	}

	@SubscribeMessage("leaveRoom")

}
