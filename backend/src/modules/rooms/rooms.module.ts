import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { RoomsService } from "./rooms.service";

@Module({
	controllers: [RoomController],
	exports: [RoomsService]
})
export class RoomsModule {}
