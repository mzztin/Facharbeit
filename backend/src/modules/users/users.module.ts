import { Module } from "@nestjs/common";
import { HashModule } from "../hash/hash.module";
import { HashService } from "../hash/hash.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	imports: [HashModule],
	controllers: [UsersController],
	providers: [UsersService, HashService]
})
export class UsersModule {}
