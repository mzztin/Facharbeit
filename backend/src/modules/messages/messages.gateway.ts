/**
 *
 * Socket und Session verbindung https://github.com/nestjs/nest/issues/445
 *
 */

import { BadRequestException, Logger, Session } from "@nestjs/common";
import {
	MessageBody, OnGatewayConnection,
	OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MySession } from "../../context";
import { RoomsService } from "../rooms/rooms.service";
import MessageDTO from "./dto/message.dto";
import { EnterRoomDTO } from "./dto/room.dto";

@WebSocketGateway(4001, {
	cors: {
	   origin: '*',
	},
	serveClient: true,
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer() server: Server;

	private logger = new Logger('MessagesGateaway');

	public constructor(private roomsService: RoomsService) {}


	afterInit(_server: any) {
		this.logger.log("Message Gateaway has been initalized");
	}

	handleConnection(client: Socket, ..._args: any[]) {

		console.debug({ _args })

		this.logger.log(`Client ${client.id} connected`)
	}

	

	handleDisconnect(client: Socket) {
		this.logger.log(`Client ${client.id} disconnected`)
	}

	@SubscribeMessage("sendMessage")
	sendMessage(client: Socket, @MessageBody() data: MessageDTO) {
		console.log({ client })
		// check here

		this.server.emit("recieveMessage", data);
	}

	@SubscribeMessage("joinRoom")
	enterRoom(
		client: Socket,
		@MessageBody() { code }: EnterRoomDTO,
		@Session() session: MySession
	) {
		console.log({ session });

		if (!this.roomsService.isValidCode(code)) {
			throw new BadRequestException("Room with given code not found");
		}

		client.join(code);

		this.server.emit("userJoinedRoom", {});
	}

	@SubscribeMessage("leaveRoom")
	leaveRoom(client: Socket) {
		console.log({ client })
	}
}
