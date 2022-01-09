// https://github.com/nestjs/nest/issues/445

import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import pgConnect from "connect-pg-simple";
import { config } from "dotenv";
import session from "express-session";
import sharedsession from "express-socket.io-session";
import { ConfigService } from "./modules/config/config.service";
config()
const PGStore = pgConnect(session);

/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class MyAdapter extends IoAdapter {
	private app: NestExpressApplication;

	constructor(app: NestExpressApplication) {
		super();
		this.app = app;
	}

	createIOServer(port: number, options?: any) {
		const server = super.createIOServer(port, options);
		const config = this.app.get(ConfigService);

		const conString = `postgres://${process.env["POSTGRES_USERNAME"]}:${process.env["POSTGRES_PASSWORD"]}@${process.env["POSTGRES_HOST"]}:${process.env["POSTGRES_PORT"]}/${process.env["POSTGRES_DATABASE"]}`

		const mySession = session({
				name: "session",
				secret: config.get("SESSION_SECRET") ?? "TOKEN NOT GIVEN",
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
			})

		this.app.use(mySession);

		server.use(sharedsession(mySession, {
			autoSave: true
		}));
		
		return server;
	}
}