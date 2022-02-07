import { Module } from "@nestjs/common";
import { HashModule } from "../hash/hash.module";
import { HashService } from "../hash/hash.service";
import { StoreModule } from "../store/store.module";
import { RoomController } from "./rooms.controller";
import { RoomsGateway } from "./rooms.gateway";
import { RoomsService } from "./rooms.service";

@Module({
	imports: [StoreModule, HashModule],
	controllers: [RoomController],
	providers: [RoomsService, RoomsGateway, HashService]
})
export class RoomsModule {}
