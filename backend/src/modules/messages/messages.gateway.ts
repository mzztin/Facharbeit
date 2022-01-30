/**
 *
 * Socket und Session verbindung https://github.com/nestjs/nest/issues/445
 *
 */
import { Logger } from "@nestjs/common";
import {
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

@WebSocketGateway(4001, {
	cors: {
		origin: "*"
	},
	serveClient: true
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer() server: Server;

	private logger = new Logger("MessagesGateaway");

	public constructor(
		private roomsService: RoomsService,
		private hashService: HashService,
		private storeService: StoreService
	) {}

	afterInit(_server: any) {
		this.logger.log("Message Gateaway has been initalized");
	}

	handleConnection(client: Socket, _: any[]) {
		this.logger.log(`Client ${client.id} connected`);
		const roomId = client.handshake.query["roomId"] as string;
		const encryptedSessionId = client.handshake.query["sessionId"];

		for (const stuff in [roomId, encryptedSessionId]) {
			if (typeof stuff !== "string" || typeof stuff == "undefined") {
				client.disconnect(true);
				return;
			}
		}

		if (!this.roomsService.isValidCode(roomId ?? "bozo")) {
			client.disconnect(true);
		}

		const sessionId = this.hashService.decryptSessionId(encryptedSessionId as string);

		const userId = this.storeService.getUserID(sessionId);

		client.data.userId = userId as number;
		client.data.roomId = roomId as string;
		client.join(roomId as string);

		this.server.to(roomId).emit("userJoined", {
			userId,
			time: Date.now()
		});
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client ${client.id} disconnected`);
	}

	@SubscribeMessage("sendMessage")
	sendMessage(client: Socket, payload: any) {
		payload = String(payload);

		this.server.to(client.data.roomId).emit("recieveMessage", {
			message: payload
		});
	}

	@SubscribeMessage("leaveRoom")
	leaveRoom(client: Socket) {
		console.log({ client });
	}
}
