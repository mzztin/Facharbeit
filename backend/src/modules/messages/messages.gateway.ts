/**
 *
 * Socket und Session verbindung https://github.com/nestjs/nest/issues/445
 *
 */
import { Logger } from "@nestjs/common";
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { HashService } from "../hash/hash.service";
import { RoomsService } from "../rooms/rooms.service";
import { StoreService } from "../store/store.service";
import MessageDTO from "./dto/message.dto";

@WebSocketGateway(4001, {
	cors: {
		origin: "*"
	},
	serveClient: true
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer() server: Server;

	private logger = new Logger("MessagesGateaway");

	public constructor(private roomsService: RoomsService, private hashService: HashService, private storeService: StoreService) {}

	private currentRooms: {
		[roomCode: string]: Socket[];
	} = {};

	afterInit(_server: any) {
		this.logger.log("Message Gateaway has been initalized");
	}

	handleConnection(client: Socket, _: any[]) {
		this.logger.log(`Client ${client.id} connected`);
		const roomId = client.handshake.query["roomId"];
		const encryptedSessionId = client.handshake.query["sessionId"];

		for (const stuff in [roomId, encryptedSessionId]) {
			if (typeof stuff !== "string" || typeof stuff == "undefined") {
				client.disconnect(true);
				return;
			}
		}

		const sessionId = this.hashService.decryptSessionId(encryptedSessionId as string);
		
		this.storeService.dump()
		const userId = this.storeService.getUserID(sessionId);

		console.log({ userId, sessionId })
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client ${client.id} disconnected`);
	}

	@SubscribeMessage("sendMessage")
	sendMessage(client: Socket, @MessageBody() data: MessageDTO) {
		console.log({ client });
		// check here

		this.server.emit("recieveMessage", data);
	}

	@SubscribeMessage("joinRoom")
	enterRoom(client: Socket, @MessageBody() code: string) {

		if (!code || !this.roomsService.isValidCode(code)) {
			return "Room with given code not found";
		}

		if (!this.currentRooms[code]) {
			this.currentRooms[code] = [];
		}

		this.currentRooms[code].push(client);

		this.server.emit("joinedRoom", {
			username: "TODO"
		});

		return "yo";
	}

	@SubscribeMessage("leaveRoom")
	leaveRoom(client: Socket) {
		console.log({ client });
	}
}
