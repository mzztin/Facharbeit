/**
 *
 * Socket und Session verbindung https://github.com/nestjs/nest/issues/445
 *
 */
import { Logger } from "@nestjs/common";
import {OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit,SubscribeMessage,WebSocketGateway,WebSocketServer} from "@nestjs/websockets";
import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { HashService } from "../hash/hash.service";
import { StoreService } from "../store/store.service";
import { RoomsService } from "./rooms.service";

@WebSocketGateway(4002, { cors: { origin: "*" }, serveClient: true })
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer() server: Server;

	private logger = new Logger("MessagesGateaway");

	public constructor(private roomsService: RoomsService, private hashService: HashService, private storeService: StoreService) {}

	afterInit(_server: any) {
		this.logger.log("Message Gateaway has been initalized");
	}

	handleConnection(client: Socket) {
		const roomId = client.handshake.query["roomId"] as string;
		const encryptedSessionId = client.handshake.query["sessionId"];

		for (const stuff in [roomId, encryptedSessionId]) {
			if (typeof stuff !== "string" || typeof stuff == "undefined") {
				this.logger.warn(`Client ${client.id} disconnected, Reason: Invalid session or room id`);
				return this.roomsService.disconnect(client);
			}
		}

		if (!this.roomsService.isValidCode(roomId ?? "-")) {
			this.logger.warn(`Client ${client.id} disconnected, Reason: Invalid room id`);
			return this.roomsService.disconnect(client);
		}

		const sessionId = this.hashService.decryptSessionId(encryptedSessionId as string);
		const userId = this.storeService.getUserID(sessionId);

		if (!userId) {
			this.logger.warn(`Client ${client.id} disconnected, Reason: no user id found`);
			return this.roomsService.reloadSocketUser(client);
		}

		client.data.userId = userId;
		client.data.roomId = roomId as string;
		client.join(roomId as string);

		this.server.to(roomId).emit("userJoined", {
			userId,
			time: Date.now()
		});

		return this.logger.log(`Client ${client.id} connected`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client ${client.id} disconnected`);
	}

	@SubscribeMessage("joinRoom")
	async joinRoom(client: Socket, payload: string) {
		if (client.data.roomId === payload) this.server.to(client.data.roomId).emit("userJoined", client.data.userId);
	}

	@SubscribeMessage("sendMessage")
	async sendMessage(client: Socket, payload: string) {
		const message = await this.roomsService.createMessage( client.data.userId, String(payload), client.data.roomId);
		this.server.to(client.data.roomId).emit("recieveMessage", message);
	}
}
