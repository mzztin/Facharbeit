import { Module } from "@nestjs/common";
import { HashService } from "./hash.service";
import { ConfigModule } from "../config/config.module";

@Module({
	imports: [ConfigModule],
	providers: [HashService]
})
export class HashModule {}
