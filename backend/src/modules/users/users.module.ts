import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { HashService } from "../hash/hash.service";
import { HashModule } from "../hash/hash.module";

@Module({
	imports: [HashModule],
	controllers: [UsersController],
	providers: [UsersService, HashService]
})
export class UsersModule {}
