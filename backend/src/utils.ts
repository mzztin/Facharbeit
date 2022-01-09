// https://github.com/nestjs/nest/issues/445

import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import pgConnect from "connect-pg-simple";
import session from "express-session";
import sharedsession from "express-socket.io-session";
import { Pool } from "pg";
import { ConfigService } from "./modules/config/config.service";

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

		const pool = new Pool({
			database: config.get("POSTGRES_DATABASE"),
			port: Number(config.get("POSTGRES_PORT")),
			user: config.get("POSTGRES_USERNAME"),
			password: config.get("POSTGRES_PASSWORD")
		});

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
					pool: pool,
					tableName: "session"
				})
			})

		this.app.use(mySession);

		server.use(sharedsession(mySession, {
			autoSave: true
		}));
		
		return server;
	}
}