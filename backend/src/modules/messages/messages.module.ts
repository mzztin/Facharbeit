import { Module } from "@nestjs/common";
import { HashModule } from "../hash/hash.module";
import { HashService } from "../hash/hash.service";
import { RoomsModule } from "../rooms/rooms.module";
import { RoomsService } from "../rooms/rooms.service";
import { StoreModule } from "../store/store.module";
import { MessagesGateway } from "./messages.gateway";

@Module({
	imports: [RoomsModule, HashModule, StoreModule],
	providers: [MessagesGateway, RoomsService, HashService]
})
export class MessagesModule {}
