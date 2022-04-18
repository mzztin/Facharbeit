import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { HashModule } from "../hash/hash.module";
import { HashService } from "../hash/hash.service";
import { StoreModule } from "../store/store.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [HashModule, StoreModule, ConfigModule],
	controllers: [UsersController],
	providers: [UsersService, HashService]
})
export class UsersModule {}
