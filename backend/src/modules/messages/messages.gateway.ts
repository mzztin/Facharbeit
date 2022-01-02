import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import MessageDTO from './dto/message.dto';
import { EnterRoomDTO } from './dto/room.dto';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  public constructor() {
    
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage("sendMessage")
  sendMessage(client: Socket, @MessageBody() data: MessageDTO) {
    // check here

    this.server.emit("recieveMessage", data);
  }

  @SubscribeMessage("g")
  enterRoom(client: Socket, @MessageBody() data: EnterRoomDTO) {
    
  }

}
