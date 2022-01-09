import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionOptions } from "typeorm";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { MessagesModule } from "../messages/messages.module";
import { RoomsModule } from "../rooms/rooms.module";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => {
				return {
					type: "postgres" as const,
					host: config.get("POSTGRES_HOST"),
					database: config.get("POSTGRES_DATABASE"),
					port: Number(config.get("POSTGRES_PORT")),
					username: config.get("POSTGRES_USERNAME"),
					password: config.get("POSTGRES_PASSWORD"),
					entities: ["dist/**/*.entity{.ts,.js}"],
					synchronize: config.get("dev") ? true : false,
					keepConnectionAlive: true
				} as ConnectionOptions;
			}
		}),
		ConfigModule,
		UsersModule,
		MessagesModule,
		RoomsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
