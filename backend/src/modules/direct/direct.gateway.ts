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
import { DirectService } from "./direct.service";

 
 @WebSocketGateway(4002, {
     cors: {
         origin: "*"
     },
     serveClient: true
 })
 export class DirectGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
     @WebSocketServer() server: Server;
 
     private logger = new Logger("DirectGateway");
 
     public constructor(
         private directService: DirectService,
         private hashService: HashService,
         private storeService: StoreService
     ) {     }
 
     afterInit(_server: any) {
         this.logger.log("DirectGateway has been initalized");
     }
 
     handleConnection(client: Socket) {
         const targetId = Number(client.handshake.query["targetId"]);
         const encryptedSessionId = client.handshake.query["sessionId"];
 
         if (targetId == NaN) {
            this.logger.warn(`Client ${client.id} disconnected, Reason: target id is not a number`)
            return this.directService.disconnect(client);
         }

         for (const stuff in [targetId, encryptedSessionId]) {
             if (typeof stuff !== "string" || typeof stuff == "undefined") {
                 this.logger.warn(`Client ${client.id} disconnected, Reason: Invalid session or room id`)
                 return this.directService.disconnect(client);
             }
         }
  
         const sessionId = this.hashService.decryptSessionId(encryptedSessionId as string);
         const userId = this.storeService.getUserID(sessionId);
 
         if (!userId) {
            this.logger.warn(`Client ${client.id} disconnected, Reason: no user id found`)
            return this.directService.reloadSocketUser(client);
         }

         client.data.userId = userId;
         client.data.targetId = targetId;
         client.join(targetId.toString());
         
         return this.logger.log(`Client ${client.id} connected`);
     }
 
     handleDisconnect(client: Socket) {
         this.logger.log(`Client ${client.id} disconnected`);
     }

     @SubscribeMessage("sendMessage")
     async sendMessage(client: Socket, payload: string) {
        const message = await this.directService.createMessage(client.data.userId, client.data.targetId, payload)

        for (const connectedSocket in (await this.server.fetchSockets())) {
            console.log({ connectedSocket })
        } 

        this.server.to(client.data.targetId).emit("recieveMessage", message);
    }
 }