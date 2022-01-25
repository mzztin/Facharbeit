import { Module } from "@nestjs/common";
import { HashModule } from "../hash/hash.module";
import { HashService } from "../hash/hash.service";
import { StoreModule } from "../store/store.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [HashModule, StoreModule],
	controllers: [UsersController],
	providers: [UsersService, HashService]
})
export class UsersModule {}
