import { Module } from "@nestjs/common";
import { RoomsModule } from "../rooms/rooms.module";
import { RoomsService } from "../rooms/rooms.service";
import { MessagesGateway } from "./messages.gateway";

@Module({
	imports: [RoomsModule],
	providers: [MessagesGateway, RoomsService]
})
export class MessagesModule {}
