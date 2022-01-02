import { Session } from "express-session";

export interface MySession extends Session {
	userId?: number;
}
