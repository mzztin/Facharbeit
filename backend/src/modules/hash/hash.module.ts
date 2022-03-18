import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { HashService } from "./hash.service";

@Module({
	imports: [ConfigModule],
	providers: [
		HashService,
		{
			provide: ConfigService,
			useValue: new ConfigService(".env")
		}
	]
})
export class HashModule {}
