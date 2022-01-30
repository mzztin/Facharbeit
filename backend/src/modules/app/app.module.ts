import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import pgConnect from "connect-pg-simple";
import session from "express-session";
import { SessionModule } from "nestjs-session";
import { ConnectionOptions } from "typeorm";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { MessagesModule } from "../messages/messages.module";
import { RoomsModule } from "../rooms/rooms.module";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

const PGStore = pgConnect(session);

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
		SessionModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => {
				const conString = `postgres://${config.get("POSTGRES_USERNAME")}:${config.get(
					"POSTGRES_PASSWORD"
				)}@${config.get("POSTGRES_HOST")}:${config.get("POSTGRES_PORT")}/${config.get(
					"POSTGRES_DATABASE"
				)}`;

				return {
					session: {
						name: "my-session-123",
						secret: "keyboard cat1234",
						resave: false,
						saveUninitialized: true,
						cookie: {
							httpOnly: false,
							secure: false,
							maxAge: 1000 * 60 * 60 * 24 * 365,
							sameSite: "lax"
						},
						store: new PGStore({
							conString
						})
					}
				};
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
