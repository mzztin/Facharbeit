import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthMiddleware } from "../auth/auth.middleware";
import { RoomController } from "./room.controller";
import { RoomsService } from "./rooms.service";

@Module({
	controllers: [RoomController],
	providers: [RoomsService]
})
export class RoomsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes("/", "/:id/messages")
	}
	
}
