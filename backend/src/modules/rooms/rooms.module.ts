import { Module } from "@nestjs/common";
import { HashModule } from "../hash/hash.module";
import { HashService } from "../hash/hash.service";
import { StoreModule } from "../store/store.module";
import { RoomController } from "./room.controller";
import { RoomGateaway } from "./room.gateaway";
import { RoomsService } from "./rooms.service";

@Module({
	imports: [StoreModule, HashModule],
	controllers: [RoomController],
	providers: [RoomsService, RoomGateaway, HashService]
})
export class RoomsModule {}
