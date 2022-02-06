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
import { StoreService } from "../store/store.service";
import RoomEntity from "./room.entity";
import RoomMessageEntity from "./room.message.entity";
import { RoomsService } from "./rooms.service";
 
 @WebSocketGateway(4001, {
     cors: {
         origin: "*"
     },
     serveClient: true
 })
 export class RoomGateaway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
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
     async sendMessage(client: Socket, payload: string) {
        console.log(payload) 
        payload = String(payload);


        let message = new RoomMessageEntity()
        message.senderId = client.data.userId as number;
        message.content = payload;
        message.createdAt = new Date();
        await message.save();

        let room = await RoomEntity.findOneOrFail({
            where: {
                code: client.data.roomId as string
            }
        });

        if (!room.messages) room.messages = [];

        room.messages.push(message);
        await room.save();    
 
         this.server.to(client.data.roomId).emit("recieveMessage", message);
     }
 
     @SubscribeMessage("leaveRoom")
     leaveRoom(_client: Socket) {}
 }