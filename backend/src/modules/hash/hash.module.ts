import { Module } from "@nestjs/common";
import { HashService } from "./hash.service";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";

@Module({
	imports: [ConfigModule],
	providers: [
		HashService,
		{
			provide: ConfigService,
			useValue: new ConfigService("misc.env")
		}
	]
})
export class HashModule {}
