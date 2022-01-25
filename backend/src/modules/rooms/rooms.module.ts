import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { RoomsService } from "./rooms.service";

@Module({
	controllers: [RoomController],
	providers: [RoomsService]
})
export class RoomsModule {

}
